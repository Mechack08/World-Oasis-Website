"use server";

import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { User } from "next-auth";

export interface ExtendedUser extends User {
  guestId: number;
}

// Authentification
async function checkUserStatus() {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const user = session.user as ExtendedUser;

  return { session, user };
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

type BookingData = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
};
export async function createBooking(
  bookingData: BookingData,
  formData: FormData
) {
  const { user } = await checkUserStatus();

  const newBooking = {
    ...bookingData,
    guestId: user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: String(formData.get("observations")).slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function updateGuest(formData: FormData) {
  const nationalIdRegex = /^[0-9]{6,20}$/;

  const session = await checkUserStatus();

  const nationalID = String(formData.get("nationalID"));
  const [nationality, countryFlag] = String(formData.get("nationality")).split(
    "%"
  );

  if (nationalID && !nationalIdRegex.test(nationalID))
    throw new Error("Please provide a valid ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId: number) {
  const session = await checkUserStatus();

  if (session.user) {
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
      throw new Error("You are not allowed to delete this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  const session = await checkUserStatus();

  const bookingId = Number(formData.get("bookingId"));

  if (session.user) {
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
      throw new Error("You are not allowed to delete this booking");
  }

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: String(formData.get("observations")),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated");

  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect("/account/reservations");
}
