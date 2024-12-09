import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import { MAX_WIDTH } from "../consts";
import useApi from "../utils/useApi.hook";

const FaqItem = ({ question, answer, id }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`faq-content-${id}`}
        id={`faq-header-${id}`}
      >
        <Typography variant="h6" fontWeight={600}>
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body1" color="text.secondary">
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

/*[
    {
      id: 1,
      question: "Who are we?",
      answer:
        "Coffee Holic is a passionate coffee shop dedicated to serving the finest blends and creating a cozy environment for our community. Whether you're grabbing a quick espresso or settling in with a latte, our mission is to provide an exceptional coffee experience for all.",
    },
    {
      id: 2,
      question: "What types of coffee do you offer?",
      answer:
        "We offer a wide variety of coffees, including single-origin brews, espresso-based drinks, cold brews, and seasonal specialties. From rich and bold dark roasts to smooth and fruity light roasts, there's something for every coffee lover at Coffee Holic.",
    },
    {
      id: 3,
      question: "How can I place an order?",
      answer:
        "You can place an order directly at our café, through our website, or via our mobile app. For online orders, simply select your desired items, choose pickup or delivery, and proceed to checkout. We also offer catering services for events and special occasions.",
    },
    {
      id: 4,
      question: "Do I need to make a reservation?",
      answer:
        "While walk-ins are always welcome, we recommend making a reservation for larger groups or during peak hours to ensure we can accommodate your party comfortably. You can reserve a table through our website or by calling us directly.",
    },
    {
      id: 5,
      question: "Do you offer free Wi-Fi?",
      answer:
        "Absolutely! We provide complimentary high-speed Wi-Fi to all our customers. Whether you're working, studying, or just browsing the web, you can stay connected while enjoying your favorite coffee.",
    },
    {
      id: 6,
      question: "Do you host events?",
      answer:
        "Yes, we regularly host a variety of events, including live music nights, coffee tasting sessions, art exhibitions, and community gatherings. Keep an eye on our events calendar or subscribe to our newsletter to stay updated on upcoming happenings at Coffee Holic.",
    },
    {
      id: 7,
      question: "How can I contact you?",
      answer:
        "You can reach us via phone at (123) 456-7890, email at support@coffeeholic.com, or through our social media channels. We’re here to answer any questions and assist you with your needs.",
    },
  ] */
export default function AboutUs() {
  const api = useApi({ method: "get", url: "/faqs", callOnMount: true });

  const faqs = api.data || [];

  return (
    <Box
      sx={{
        width: "calc(100% - 64px)",
        maxWidth: MAX_WIDTH,
        margin: "0 auto",
        px: 2,
        py: 4,
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: "2.5rem", sm: "3rem" } }}
        fontWeight={700}
        mb={3}
      >
        Frequently Asked Questions
      </Typography>

      {faqs.map((faq) => (
        <FaqItem
          key={faq.id}
          id={faq.id}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </Box>
  );
}
