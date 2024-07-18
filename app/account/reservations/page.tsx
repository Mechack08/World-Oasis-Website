import ReservationList from "@/app/_components/ReservationList";
import { ExtendedUser } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { Booking, CabinBooked, getBookings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Reservation",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user) return;

  const user = session.user as ExtendedUser;

  const bookings = await getBookings(user.guestId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
