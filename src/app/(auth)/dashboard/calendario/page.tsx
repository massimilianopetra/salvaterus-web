'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Button, IconButton } from '@mui/material';
import { Today, CalendarViewMonth, ViewWeek, ViewDay } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, addDays, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { DbCalendarEvent } from '@/app/lib/definitions';
import { generateWorkSchedule } from '@/app/lib/workShift';
import { getThisMonthEvents, addCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from '@/app/lib/actions';
import EventDialog from '@/app/(auth)/dashboard/components/EventDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CalendarPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<DbCalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState<DbCalendarEvent>({
    id: 0,
    title: '',
    start: formatDate(currentDate),
    finish: formatDate(currentDate),
    description: '',
    color: '#1976d2',
    is_deadline: false
  })



  // Fetch events from PostgreSQL and generate work shifts
  useEffect(() => {
    console.log("CALENDAR FETCH");
    const fetchEventsAndShifts = async () => {
      try {
        setLoading(true);

        // 1. Fetch events from database
        const dbEvents = await getThisMonthEvents(currentDate);

        // 2. Calculate work shifts for current month
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const workShifts = generateWorkSchedule(
          startDate,
          7,
        );

        // 3. Combina gli eventi
        const allEvents = [...dbEvents || [], ...workShifts];

        setEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndShifts();
  }, [currentDate]);

  /*function formatDate(d: Date): string {
    return d.toISOString().slice(0, 19).replace('T', ' ');
  }*/

  function formatDate(d: Date): string {
    return d.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+),?/, '$3-$2-$1').replace(/\./g, ':');
  }

  // Verifica se un evento è attivo in un giorno specifico (per eventi multi-giorno)
  const isEventActiveOnDay = (event: DbCalendarEvent, day: Date) => {
    const eventStart = new Date(event.start); // Converti in Date
    const eventFinish = new Date(event.finish); // Converti in Date
    return isSameDay(eventStart, day) ||
      isSameDay(eventFinish, day) ||
      (day > eventStart && day < eventFinish);
  };

  const handleViewChange = (event: React.SyntheticEvent, newValue: 'month' | 'week' | 'day') => {
    setView(newValue);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) setCurrentDate(date);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateToPrevious = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateToNext = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveEvent = async (event: DbCalendarEvent) => {
    try {


      if (event.id == -1) {

        // Chiamata API per aggiornare l'evento nel database
        const addedEvent = await addCalendarEvent(event); // scrittura su DB
        console.log('Added:', addedEvent);
        setEvents(prev => [...prev, addedEvent]);
      }
      else {
        // Aggiorna nella lista locale
        setEvents(prev => prev.map(e => e.id === event.id ? event : e));

        // Chiamata API per aggiornare l'evento nel database
        await updateCalendarEvent(event);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Errore salvataggio evento:', error);
    }
  };

  const handleNewEvent = () => {

    // Apri un dialog di modifica (puoi riusare EventDialog passando l'evento)
    const newEvent = {
      id: -1,
      title: '',
      start: formatDate(currentDate),
      finish: formatDate(currentDate),
      description: '',
      color: '#2196F3',
      is_deadline: false
    }
    setNewEvent(newEvent);
    setOpenDialog(true);
  };

  const handleEditEvent = (event: DbCalendarEvent) => {
    // Apri un dialog di modifica (puoi riusare EventDialog passando l'evento)

    const newEvent = {
      id: event.id,
      title: event.title,
      start: event.start,
      finish: event.finish,
      description: event.description,
      color: event.color,
      is_deadline: event.is_deadline
    }

    setNewEvent(newEvent);
    setOpenDialog(true);
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Vuoi davvero eliminare questo evento?')) return;
    await deleteCalendarEvent(id);
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  // Funzioni di rendering
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks: Date[][] = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const handleDayClick = (day: Date) => {
      setCurrentDate(day);
      setView('day');
    };

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
            <Typography key={day} align="center" sx={{ width: '14%', fontWeight: 'bold' }}>
              {day}
            </Typography>
          ))}
        </Box>

        {weeks.map((week, weekIndex) => (
          <Box key={weekIndex} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            {week.map((day, dayIndex) => {
              const dayEvents = events.filter(event => isEventActiveOnDay(event, day));
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <Paper
                  key={dayIndex}
                  elevation={1}
                  onClick={() => handleDayClick(day)}
                  sx={{
                    width: '14%',
                    minHeight: 100,
                    p: 1,
                    bgcolor: isSameDay(day, new Date()) ? 'action.selected' : 'background.paper',
                    opacity: isCurrentMonth ? 1 : 0.5,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <Typography variant="body2" align="right">
                    {format(day, 'd')}
                  </Typography>
                  <Box sx={{ maxHeight: 80, overflow: 'auto' }}>
                    {dayEvents.map((event) => (
                      <Paper
                        key={`${event.id}-${day.toISOString()}`}
                        sx={{
                          p: 0.5,
                          mb: 0.5,
                          bgcolor: event.color || 'primary.light',
                          color: 'common.white',
                          fontSize: '0.75rem'
                        }}
                      >
                        {isSameDay(event.start, day) ?
                          `${format(event.start, 'HH:mm')} ${event.title}` :
                          event.title}
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        ))}
      </Box>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

    const handleDayClick = (day: Date) => {
      setCurrentDate(day);
      setView('day');
    };

    return (
      <Box sx={{ display: 'flex', mt: 2 }}>
        {days.map((day, index) => {
          const dayEvents = events.filter(event => isEventActiveOnDay(event, day));

          return (
            <Box key={index} sx={{ width: '14.28%' }}>
              <Paper
                elevation={1}
                onClick={() => handleDayClick(day)}
                sx={{
                  p: 1,
                  bgcolor: isSameDay(day, new Date()) ? 'action.selected' : 'background.paper',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <Typography variant="body1" align="center" fontWeight="bold">
                  {format(day, 'EEE d', { locale: it })}
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {dayEvents.map((event) => (
                    <Paper
                      key={`${event.id}-${day.toISOString()}`}
                      onClick={() => handleDayClick(typeof event.start === 'string' ? parseISO(event.start) : event.start)}
                      sx={{
                        p: 1,
                        mb: 1,
                        bgcolor: event.color || 'primary.light',
                        color: 'common.white',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                    >
                      {isSameDay(event.start, day) ? (
                        <>
                          <Typography variant="body2">
                            {format(event.start, 'HH:mm')} - {format(event.finish, 'HH:mm')}
                          </Typography>
                          <Typography variant="subtitle2">{event.title}</Typography>
                        </>
                      ) : (
                        <Typography variant="subtitle2">{event.title} (continua)</Typography>
                      )}
                      {event.is_deadline && (
                        <Typography variant="caption" sx={{ color: 'error.main' }}>
                          SCADENZA
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderDayView = () => {
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventFinish = new Date(event.finish);
      return isSameDay(eventStart, currentDate) ||
        isSameDay(eventFinish, currentDate) ||
        (currentDate > eventStart && currentDate < eventFinish);
    });

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {format(currentDate, 'EEEE d MMMM yyyy', { locale: it })}
          </Typography>
          <Button variant="contained" onClick={handleNewEvent}>Aggiungi Evento</Button>
        </Box>

        {dayEvents.length === 0 ? (
          <Typography>Nessun evento programmato per oggi</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {dayEvents.map((event) => {
              console.log(event);
              const startDate = new Date(event.start);
              const finishDate = new Date(event.finish);
              const durationDays = Math.ceil(
                (finishDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Paper
                  key={event.id}
                  elevation={3}
                  sx={{
                    p: 2,
                    borderLeft: 4,
                    borderColor: event.color
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{event.title}</Typography>
                    {event.id != -999 && (
                      <Box>
                        <IconButton size="small" onClick={() => {
                          const formattedEvent = {
                            id: event.id,
                            title: event.title,
                            start: formatDate(new Date(event.start)),
                            finish: formatDate(new Date(event.finish)),
                            description: event.description,
                            color: event.color,
                            is_deadline: event.is_deadline
                          }
                          handleEditEvent(formattedEvent);

                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteEvent(event.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  {event.is_deadline && (
                    <Typography color="error" fontWeight="bold">SCADENZA</Typography>
                  )}
                  <Typography variant="subtitle1" color="text.secondary">
                    {format(startDate, 'dd/MM/yyyy HH:mm')} - {format(finishDate, 'dd/MM/yyyy HH:mm')}
                  </Typography>
                  {!isSameDay(startDate, finishDate) && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      (Evento di {durationDays} giorni)
                    </Typography>
                  )}
                  <Typography sx={{ mt: 1 }}>{event.description}</Typography>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
      <Box sx={{
        p: 4,
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}>
        <Typography variant="h4">Calendario</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={navigateToToday}
            >
              Oggi
            </Button>

            <DatePicker
              value={currentDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: 150 },
                },
              }}
            />

            <Box>
              <IconButton onClick={navigateToPrevious}>
                <Typography variant="h6">‹</Typography>
              </IconButton>
              <IconButton onClick={navigateToNext}>
                <Typography variant="h6">›</Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={view} onChange={handleViewChange} centered>
            <Tab label="Mese" value="month" icon={<CalendarViewMonth />} iconPosition="start" />
            <Tab label="Settimana" value="week" icon={<ViewWeek />} iconPosition="start" />
            <Tab label="Giorno" value="day" icon={<ViewDay />} iconPosition="start" />
          </Tabs>
        </Paper>

        {loading ? (
          <Typography>Caricamento...</Typography>
        ) : view === 'month' ? (
          renderMonthView()
        ) : view === 'week' ? (
          renderWeekView()
        ) : (
          renderDayView()
        )}
      </Box>

      {/* Dialog per inserimento evento in calendario */}
      <EventDialog
        open={openDialog}
        event={newEvent}
        onClose={handleCloseDialog}
        onSave={handleSaveEvent}
      />

    </LocalizationProvider>

  );
}