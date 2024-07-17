"use client";

import ReservationCard from "./ReservationCard";
import { Booking } from "../_lib/data-service";
import { useOptimistic } from "react";
import { deleteReservation } from "../_lib/actions";

interface ReservationListProps {
  bookings: Booking[];
}

export default function ReservationList({ bookings }: ReservationListProps) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId: number) =>
      curBookings.filter((booking) => booking.id !== bookingId)
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDeleteReservation={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}
