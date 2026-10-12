import test from "node:test";
import assert from "node:assert/strict";
import {
  validateEnquiry,
  enquiryMessage,
  enquiryLink,
} from "../lib/enquiry.mjs";
const data = {
  name: "Anu & Team",
  mobile: "+91 9876543210",
  email: "",
  service: "Film Production & Crowd Solutions",
  date: "2030-05-10",
  location: "Kochi",
  requirements: "12 background artists & production support",
};
test("required details and valid input", () => {
  assert.deepEqual(validateEnquiry(data, "2030-05-01"), {});
  for (const key of ["name", "mobile", "service", "location", "requirements"])
    assert.ok(validateEnquiry({ ...data, [key]: " " }, "2030-05-01")[key]);
});
test("phone and optional email validation", () => {
  for (const mobile of ["abc", "123", "1234567890123456", "+91<script>"])
    assert.ok(validateEnquiry({ ...data, mobile }, "2030-05-01").mobile);
  assert.ok(validateEnquiry({ ...data, email: "bad@" }, "2030-05-01").email);
  assert.deepEqual(
    validateEnquiry({ ...data, email: "anu@example.com" }, "2030-05-01"),
    {},
  );
});
test("date is optional, real, and not in the past", () => {
  assert.deepEqual(validateEnquiry({ ...data, date: "" }, "2030-05-01"), {});
  for (const date of ["2030-02-30", "2030-04-30", "invalid"])
    assert.ok(validateEnquiry({ ...data, date }, "2030-05-01").date);
  assert.deepEqual(validateEnquiry(data, "2030-05-10"), {});
});
test("email message preserves details and URL encoding", () => {
  const m = enquiryMessage(data);
  const href = enquiryLink(
    {
      email: "crewversegang@gmail.com",
      whatsappNumber: "919746071345",
      whatsappConfirmed: false,
    },
    m,
  );
  assert.ok(href.startsWith("mailto:crewversegang@gmail.com"));
  const u = new URL(href);
  assert.equal(u.searchParams.get("body"), m);
  assert.match(m, /Anu & Team/);
  assert.match(m, /12 background artists & production support/);
  assert.doesNotMatch(m, /booking confirmed/i);
});
test("WhatsApp requires a confirmed valid number and otherwise falls back to email", () => {
  const c = {
    email: "crewversegang@gmail.com",
    whatsappNumber: "919746071345",
    whatsappConfirmed: false,
  };
  assert.ok(enquiryLink(c, "a & b", "whatsapp").startsWith("mailto:"));
  const u = new URL(
    enquiryLink({ ...c, whatsappConfirmed: true }, "a & b", "whatsapp"),
  );
  assert.equal(u.hostname, "wa.me");
  assert.equal(u.searchParams.get("text"), "a & b");
  assert.ok(
    enquiryLink(
      { ...c, whatsappNumber: "invalid", whatsappConfirmed: true },
      "test",
      "whatsapp",
    ).startsWith("mailto:"),
  );
});
