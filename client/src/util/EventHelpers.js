export function RSVPStatus(event, user_id) {
  const will_attend = event.will_attend.some((attendee) => {
    return attendee._id == user_id;
  });
  const maybe = event.maybe.some((attendee) => {
    return attendee._id == user_id;
  });
  const will_not_attend = event.will_not_attend.some((attendee) => {
    return attendee._id == user_id;
  });

  if (will_attend) {
    return "will_attend";
  }
  if (maybe) {
    return "maybe";
  }
  if (will_not_attend) {
    return "will_not_attend";
  }
  return null;
}