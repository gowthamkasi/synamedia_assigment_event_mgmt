const reservations = [];
let seatCounter = 1;
let emptySeats = [];

export class EventService {
  async reserveTicket(name, email, eventDate) {
    try {
      console.log('Inside reserveTicket service');

      let seatNumber;

      if (emptySeats.length > 0) {
        seatNumber = emptySeats.pop();
      } else {
        seatNumber = seatCounter++;
      }

      const reservation = { name, email, eventDate, seatNumber };
      reservations.push(reservation);

      return reservation;
    } catch (error) {
      throw new Error('Error reserving ticket');
    }
  }

  async ticketExists(email, eventDate) {
    try {
      console.log('Inside ticketExists service');

      return reservations.some(
        (ticket) => ticket.email === email && ticket.eventDate === eventDate
      );
    } catch (error) {
      throw new Error('Error checking ticket existence');
    }
  }

  async viewTicket(email) {
    try {
      console.log('Inside viewTicket service');

      return reservations.find((ticket) => ticket.email === email);
    } catch (error) {
      throw new Error('Error retrieving ticket details');
    }
  }

  async viewAllAttendees(eventDate) {
    try {
      console.log('Inside viewAllAttendees service');

      const attendees = reservations.filter(
        (ticket) => ticket.eventDate === eventDate
      );

      const data = attendees.map((ticket) => ({
        name: ticket.name,
        seatNumber: ticket.seatNumber,
      }));

      return {
        attendees: data,
        count: data.length,
      };
    } catch (error) {
      throw new Error('Error retrieving attendees');
    }
  }

  async cancelReservation(email, eventDate) {
    try {
      console.log('Inside cancelReservation service');

      const index = reservations.findIndex(
        (ticket) => ticket.email === email && ticket.eventDate === eventDate
      );

      emptySeats.push(reservations[index].seatNumber);
      reservations.splice(index, 1);
    } catch (error) {
      throw new Error('Error cancelling reservation');
    }
  }

  async modifySeatReservation(email, eventDate) {
    try {
      console.log('Inside modifySeatReservation service');

      let newSeatNumber;

      for (let i = 0; i < reservations.length; i++) {
        const ticket = reservations[i];

        if (ticket.email === email && ticket.eventDate === eventDate) {
          const seatNumber = ticket.seatNumber;

          if (emptySeats.length > 0) {
            ticket.seatNumber = emptySeats.pop();
          } else {
            ticket.seatNumber = seatCounter++;
          }

          newSeatNumber = ticket.seatNumber;

          emptySeats.push(seatNumber);

          break;
        }
      }

      return {
        email,
        eventDate,
        seat: newSeatNumber,
      };
    } catch (error) {
      throw new Error('Error modifying seat reservation');
    }
  }
}
