'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Button, IconButton } from '@mui/material';
import { Today, CalendarViewMonth, ViewWeek, ViewDay } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { it } from 'date-fns/locale';

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  color: string;
  isDeadline: boolean;
}

export default function CalendarPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch events from PostgreSQL
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        /*const response = await fetch('/api/events');
        const data = await response.json();*/

        const data: any[] = [];
        setEvents(data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        })));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

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
              const dayEvents = events.filter(event => isSameDay(event.start, day));
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <Paper
                  key={dayIndex}
                  elevation={1}
                  sx={{
                    width: '14%',
                    minHeight: 100,
                    p: 1,
                    bgcolor: isSameDay(day, new Date()) ? 'action.selected' : 'background.paper',
                    opacity: isCurrentMonth ? 1 : 0.5
                  }}
                >
                  <Typography variant="body2" align="right">
                    {format(day, 'd')}
                  </Typography>
                  <Box sx={{ maxHeight: 80, overflow: 'auto' }}>
                    {dayEvents.map((event) => (
                      <Paper
                        key={event.id}
                        sx={{
                          p: 0.5,
                          mb: 0.5,
                          bgcolor: event.color || 'primary.light',
                          color: 'common.white',
                          fontSize: '0.75rem'
                        }}
                      >
                        {format(event.start, 'HH:mm')} {event.title}
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

    return (
      <Box sx={{ display: 'flex', mt: 2 }}>
        {days.map((day, index) => {
          const dayEvents = events.filter(event => isSameDay(event.start, day));

          return (
            <Box key={index} sx={{ width: '14.28%' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  bgcolor: isSameDay(day, new Date()) ? 'action.selected' : 'background.paper'
                }}
              >
                <Typography variant="body1" align="center" fontWeight="bold">
                  {format(day, 'EEE d', { locale: it })}
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {dayEvents.map((event) => (
                    <Paper
                      key={event.id}
                      sx={{
                        p: 1,
                        mb: 1,
                        bgcolor: event.color || 'primary.light',
                        color: 'common.white'
                      }}
                    >
                      <Typography variant="body2">
                        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                      </Typography>
                      <Typography variant="subtitle2">{event.title}</Typography>
                      {event.isDeadline && (
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
    const dayEvents = events.filter(event => isSameDay(event.start, currentDate));

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {format(currentDate, 'EEEE d MMMM yyyy', { locale: it })}
        </Typography>

        {dayEvents.length === 0 ? (
          <Typography>Nessun evento programmato per oggi</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {dayEvents.map((event) => (
              <Paper
                key={event.id}
                elevation={3}
                sx={{
                  p: 2,
                  borderLeft: 4,
                  borderColor: event.isDeadline ? 'error.main' : event.color || 'primary.main'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{event.title}</Typography>
                  {event.isDeadline && (
                    <Typography color="error" fontWeight="bold">SCADENZA</Typography>
                  )}
                </Box>
                <Typography variant="subtitle1" color="text.secondary">
                  {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </Typography>
                <Typography sx={{ mt: 1 }}>{event.description}</Typography>
              </Paper>
            ))}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Calendario</Typography>

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
    </LocalizationProvider>
  );
}