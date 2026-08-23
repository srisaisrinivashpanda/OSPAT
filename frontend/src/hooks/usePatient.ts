'use client';

import { useState, useCallback } from 'react';

const DEFAULT_PATIENT_ID = 1;

export function usePatient() {
  const [patientId, setPatientIdState] = useState<number>(DEFAULT_PATIENT_ID);

  const setPatientId = useCallback((id: number) => {
    setPatientIdState(id);
  }, []);

  return { patientId, setPatientId };
}

export { DEFAULT_PATIENT_ID };
