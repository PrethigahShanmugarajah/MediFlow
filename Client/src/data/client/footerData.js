import { Facebook, Instagram, Linkedin, Github } from "lucide-react";

export const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Doctors", href: "/doctors" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
  { name: "Appointments", href: "/appointments" },
];

export const services = [
  { name: "Blood Pressure Check", href: "/services" },
  { name: "Blood Sugar Test", href: "/services" },
  { name: "Full Blood Count", href: "/services" },
  { name: "X-Ray Scan", href: "/services" },
  { name: "Cholesterol Screening", href: "/services" },
];

export const socialLinks = [
  {
    Icon: Facebook,
    color: "hover:text-blue-600",
    name: "Facebook",
    href: "#",
  },
  {
    Icon: Instagram,
    color: "hover:text-pink-600",
    name: "Instagram",
    href: "#",
  },
  {
    Icon: Linkedin,
    color: "hover:text-blue-700",
    name: "LinkedIn",
    href: "#",
  },
  {
    Icon: Github,
    name: "GitHub",
    href: "#",
    color: "hover:text-gray-800",
  },
];
