export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function validDate(value) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function validateEnquiry(data, today = localDate()) {
  const errors = {};
  for (const field of ["name", "mobile", "service", "location", "requirements"])
    if (!String(data[field] || "").trim())
      errors[field] = "Please complete this field.";
  if (data.mobile && !/^\+?[0-9 ()-]{7,22}$/.test(data.mobile))
    errors.mobile = "Enter a valid phone number.";
  if (data.mobile) {
    const digits = data.mobile.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15)
      errors.mobile = "Enter a phone number with 7–15 digits.";
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";
  if (data.date && (!validDate(data.date) || data.date < today))
    errors.date = "Choose today or a future date.";
  return errors;
}
export function enquiryMessage(data) {
  return [
    "Hello CREWVERSE, I would like to discuss a crew requirement.",
    "",
    `Name: ${data.name.trim()}`,
    `Mobile: ${data.mobile.trim()}`,
    ...(data.email.trim() ? [`Email: ${data.email.trim()}`] : []),
    `Service: ${data.service}`,
    ...(data.date ? [`Event / production date: ${data.date}`] : []),
    `City / location: ${data.location.trim()}`,
    "",
    `Requirements: ${data.requirements.trim()}`,
    "",
    "Please contact me to discuss availability, roles, arrangements and a quote.",
  ].join("\n");
}
export function enquiryLink(company, message, channel = "email") {
  if (
    channel === "whatsapp" &&
    company.whatsappConfirmed &&
    /^[1-9]\d{6,14}$/.test(company.whatsappNumber)
  )
    return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
  return `mailto:${company.email}?subject=${encodeURIComponent("CREWVERSE — Crew enquiry")}&body=${encodeURIComponent(message)}`;
}
