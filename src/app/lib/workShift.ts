// lib/workShifts.ts
'use client'

import { DbCalendarEvent } from '@/app/lib/definitions';

export type WorkShift = {
  start: string;
  end: string;
};

export type WorkShiftPattern = {
  weekNumber: number;
  monday?: WorkShift[];
  tuesday?: WorkShift[];
  wednesday?: WorkShift[];
  thursday?: WorkShift[];
  friday?: WorkShift[];
  saturday?: WorkShift[];
  sunday?: WorkShift[];
};

export const wifeWorkPatterns: WorkShiftPattern[] = [
  // Settimana 1 (A)
  {
    weekNumber: 1,
    monday: [{ start: "18:00", end: "21:00" }],
    tuesday: [{ start: "17:30", end: "20:30" }],
    wednesday: [{ start: "16:45", end: "19:45" }],
    friday: [{ start: "17:00", end: "21:15" }],
    saturday: [{ start: "17:30", end: "21:15" }],
    sunday: [{ start: "09:45", end: "12:45" }]
  },
  // Settimana 2 (B)
  {
    weekNumber: 2,
    monday: [{ start: "10:30", end: "14:00" }],
    wednesday: [{ start: "09:30", end: "13:15" }],
    thursday: [{ start: "08:30", end: "13:00" }],
    friday: [{ start: "09:30", end: "13:15" }],
    saturday: [{ start: "09:30", end: "14:00" }]
  },
  // Settimana 3 (C)
  {
    weekNumber: 3,
    monday: [{ start: "16:15", end: "20:00" }],
    tuesday: [{ start: "16:15", end: "20:45" }],
    wednesday: [{ start: "17:00", end: "20:15" }],
    thursday: [{ start: "16:00", end: "20:00" }],
    friday: [{ start: "11:00", end: "15:30" }]
  },
  // Settimana 4 (D)
  {
    weekNumber: 4,
    tuesday: [{ start: "17:00", end: "20:00" }],
    wednesday: [{ start: "17:15", end: "20:15" }],
    thursday: [{ start: "16:45", end: "19:45" }],
    friday: [{ start: "16:45", end: "20:15" }],
    saturday: [{ start: "15:15", end: "19:45" }],
    sunday: [{ start: "10:00", end: "13:00" }]
  },
  // Settimana 5 (E)
  {
    weekNumber: 5,
    tuesday: [{ start: "08:30", end: "13:00" }],
    wednesday: [{ start: "09:15", end: "12:30" }],
    thursday: [{ start: "09:45", end: "13:00" }],
    friday: [{ start: "08:30", end: "13:00" }],
    saturday: [{ start: "09:00", end: "13:30" }]
  },
  // Settimana 6 (F)
  {
    weekNumber: 6,
    monday: [{ start: "17:00", end: "21:15" }],
    tuesday: [{ start: "15:45", end: "18:45" }],
    wednesday: [{ start: "17:30", end: "21:15" }],
    friday: [{ start: "16:15", end: "20:45" }],
    saturday: [{ start: "15:45", end: "20:15" }]
  },
  // Settimana 7 (G)
  {
    weekNumber: 7,
    monday: [{ start: "09:00", end: "13:00" }],
    wednesday: [{ start: "08:30", end: "13:00" }],
    friday: [{ start: "15:30", end: "19:30" }],
    saturday: [{ start: "09:00", end: "13:30" }],
    sunday: [{ start: "17:15", end: "20:15" }]
  },
  // Settimana 8 (H)
  {
    weekNumber: 8,
    monday: [{ start: "14:45", end: "18:15" }],
    tuesday: [{ start: "10:30", end: "14:30" }],
    thursday: [{ start: "09:00", end: "13:00" }],
    friday: [{ start: "09:00", end: "13:00" }],
    saturday: [{ start: "09:15", end: "13:45" }]

  },
  // Settimana 9 (I)
  {
    weekNumber: 9,
    monday: [{ start: "13:30", end: "16:30" }],
    tuesday: [{ start: "17:45", end: "21:15" }],
    wednesday: [{ start: "17:30", end: "21:15" }],
    thursday: [{ start: "18:15", end: "21:15" }],
    friday: [{ start: "17:15", end: "20:15" }],
    saturday: [{ start: "16:30", end: "20:15" }]
  },
  // Settimana 10 (J)
  {
    weekNumber: 10,
    wednesday: [{ start: "09:00", end: "13:00" }],
    thursday: [{ start: "08:30", end: "12:15" }],
    friday: [{ start: "08:30", end: "12:30" }],
    saturday: [{ start: "11:00", end: "15:30" }],
    sunday: [{ start: "16:30", end: "20:15" }]
  },
  // Settimana 11 (K)
  {
    weekNumber: 11,
    monday: [{ start: "08:30", end: "12:30" }],
    wednesday: [{ start: "10:00", end: "14:30" }],
    thursday: [{ start: "10:00", end: "14:30" }],
    friday: [{ start: "09:45", end: "12:45" }],
    saturday: [{ start: "10:00", end: "14:00" }],
  },
  // Settimana 12 (L)
  {
    weekNumber: 12,
    monday: [{ start: "16:30", end: "20:30" }],
    tuesday: [{ start: "15:45", end: "19:45" }],
    wednesday: [{ start: "16:00", end: "20:00" }],
    friday: [{ start: "16:15", end: "20:15" }],
    saturday: [{ start: "17:15", end: "21:15" }]
  },
  // Settimana 13 (M)
  {
    weekNumber: 13,
    monday: [{ start: "09:15", end: "12:15" }],
    tuesday: [{ start: "09:45", end: "12:45" }],
    wednesday: [{ start: "10:15", end: "13:15" }],
    thursday: [{ start: "09:30", end: "13:15" }],
    saturday: [{ start: "08:45", end: "13:00" }],
    sunday: [{ start: "09:00", end: "12:00" }]
  },
  // Settimana 14 (N)
  {
    weekNumber: 14,
    monday: [{ start: "15:45", end: "20:15" }],
    tuesday: [{ start: "15:15", end: "19:15" }],
    thursday: [{ start: "17:45", end: "21:00" }],
    friday: [{ start: "14:30", end: "18:45" }],
    saturday: [{ start: "09:30", end: "13:30" }]
  },
  // Settimana 15 (O)
  {
    weekNumber: 15,
    monday: [{ start: "09:30", end: "12:30" }],
    tuesday: [{ start: "09:15", end: "12:30" }],
    wednesday: [{ start: "09:15", end: "12:30" }],
    thursday: [{ start: "10:00", end: "13:00" }],
    friday: [{ start: "09:15", end: "13:00" }],
    saturday: [{ start: "15:30", end: "19:15" }]
  },
  // Settimana 16 (P)
  {
    weekNumber: 16,
    wednesday: [{ start: "15:45", end: "20:00" }],
    thursday: [{ start: "16:00", end: "20:15" }],
    friday: [{ start: "16:15", end: "20:30" }],
    saturday: [{ start: "17:00", end: "21:15" }],
    sunday: [{ start: "10:30", end: "13:30" }]
  },
  // Settimana 17 (Q)
  {
    weekNumber: 17,
    monday: [{ start: "09:30", end: "12:30" }],
    wednesday: [{ start: "09:30", end: "13:30" }],
    thursday: [{ start: "09:00", end: "13:30" }],
    friday: [{ start: "09:15", end: "13:30" }],
    saturday: [{ start: "09:00", end: "13:15" }]
  },
  // Settimana 18 (R)
  {
    weekNumber: 18,
    monday: [{ start: "14:45", end: "19:15" }],
    tuesday: [{ start: "14:45", end: "18:45" }],
    wednesday: [{ start: "16:15", end: "19:30" }],
    thursday: [{ start: "15:00", end: "19:30" }],
    friday: [{ start: "16:00", end: "19:45" }],
  },
  // Settimana 19 (S)
  {
    weekNumber: 19,
    monday: [{ start: "09:00", end: "12:30" }],
    tuesday: [{ start: "09:00", end: "12:30" }],
    friday: [{ start: "14:00", end: "18:30" }],
    saturday: [{ start: "08:30", end: "12:30" }],
    sunday: [{ start: "15:15", end: "19:45" }]
  },
  // Settimana 20 (T)
  {
    weekNumber: 20,
    monday: [{ start: "16:45", end: "20:45" }],
    tuesday: [{ start: "12:30", end: "16:30" }],
    wednesday: [{ start: "12:30", end: "16:30" }],
    friday: [{ start: "17:15", end: "21:15" }],
    saturday: [{ start: "17:15", end: "21:15" }]
  },
  // Settimana 21 (U)
  {
    weekNumber: 21,
    monday: [{ start: "11:30", end: "14:45" }],
    tuesday: [{ start: "09:30", end: "12:30" }],
    wednesday: [{ start: "09:30", end: "12:45" }],
    thursday: [{ start: "10:45", end: "15:15" }],
    friday: [{ start: "09:15", end: "12:15" }],
    saturday: [{ start: "09:30", end: "12:30" }]
  },
  // Settimana 22 (V)
  {
    weekNumber: 22,
    monday: [{ start: "16:45", end: "19:45" }],
    tuesday: [{ start: "16:15", end: "19:30" }],
    wednesday: [{ start: "16:00", end: "19:45" }],
    friday: [{ start: "16:15", end: "19:45" }],
    saturday: [{ start: "16:30", end: "20:00" }],
    sunday: [{ start: "09:30", end: "12:30" }]
  },
  // Settimana 23 (W)
  {
    weekNumber: 23,
    monday: [{ start: "15:45", end: "19:45" }],
    tuesday: [{ start: "17:00", end: "21:00" }],
    thursday: [{ start: "16:45", end: "20:45" }],
    friday: [{ start: "12:30", end: "16:30" }],
    saturday: [{ start: "15:30", end: "19:30" }]
  },
  // Settimana 24 (X)
  {
    weekNumber: 24,
    monday: [{ start: "08:30", end: "12:30" }],
    tuesday: [{ start: "09:30", end: "13:30" }],
    wednesday: [{ start: "09:30", end: "13:30" }],
    thursday: [{ start: "09:00", end: "13:00" }],
    friday: [{ start: "09:00", end: "13:00" }]
  }
];


export function generateWorkSchedule(
  startDate: Date,
  weeksToGenerate: number
): DbCalendarEvent[] {

  console.log("************* Start Date ************");
  console.log(startDate);
  console.log("*********************************");

  const events: DbCalendarEvent[] = [];
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + weeksToGenerate * 7);

  // Data di riferimento: 4 agosto 2025 (Lunedì, inizio settimana 8)
  const referenceDate = new Date('2025-08-04T00:00:00');
  const referenceWeek = 7

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Calcola giorni passati dal 4 agosto 2025
    const diffInDays = Math.floor((currentDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calcola la settimana lavorativa (ciclo di 24 settimane)
    const weeksPassed = Math.floor(diffInDays / 7);
    const currentWorkWeek = ((referenceWeek + weeksPassed) % 24);

    

    const pattern = wifeWorkPatterns[currentWorkWeek]; // -1 perché l'array è 0-based

    // Converti il giorno della settimana (0=Lunedì, 6=Domenica)
    const dayOfWeek = (currentDate.getDay() + 6) % 7;

    let dayShifts: WorkShift[] = [];

    //console.log(currentDate, diffInDays, weeksPassed, currentWorkWeek,dayOfWeek)
    //console.log(pattern)
    switch (dayOfWeek) {
      case 0: dayShifts = pattern.monday || []; break;
      case 1: dayShifts = pattern.tuesday || []; break;
      case 2: dayShifts = pattern.wednesday || []; break;
      case 3: dayShifts = pattern.thursday || []; break;
      case 4: dayShifts = pattern.friday || []; break;
      case 5: dayShifts = pattern.saturday || []; break;
      case 6: dayShifts = pattern.sunday || []; break;
    }

    for (const shift of dayShifts) {
      const [startHour, startMinute] = shift.start.split(':').map(Number);
      const [endHour, endMinute] = shift.end.split(':').map(Number);

      const startTime = new Date(currentDate);
      startTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(currentDate);
      endTime.setHours(endHour, endMinute, 0, 0);

      events.push({
        id: -999,
        title: 'Turno di lavoro',
        start: startTime.toISOString(),
        finish: endTime.toISOString(),
        description: `Turno settimana ${currentWorkWeek+1}`,
        color: endTime.getHours() < 14 ? '#4CAF50' : '#000000', // Verde se prima delle 14, altrimenti nero
        is_deadline: false
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("************* Events ************")
  //console.log(events);
  console.log("*********************************")

  return events;
}