"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { DateRange } from "react-day-picker";

type Context = {
  range?: DateRange;
  setRange: Dispatch<SetStateAction<DateRange | undefined>>;
  resetRange: () => void;
};

interface ReservationProviderProps {
  children: ReactNode;
}

const initialSate: DateRange = { from: undefined, to: undefined };

const ReservationContext = createContext<Context | null>(null);

function ReservationProvider({ children }: ReservationProviderProps) {
  const [range, setRange] = useState<DateRange>();

  const resetRange = () => setRange(initialSate);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

/* Custom hook */
function useReservation() {
  const context = useContext(ReservationContext);

  if (context === null) {
    throw new Error("Context was used outside provider");
  }

  return context;
}

export { ReservationProvider, useReservation };
