import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { MAX_WIDTH } from "../consts";
import useApi from "../utils/useApi.hook";
import { useAuth } from "../contexts/auth.context";

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

export default function AboutUs() {
  const api = useApi({ method: "get", url: "/faqs", callOnMount: true });
  const [openNewQuestionDialog, setOpenNewQuestionDialog] = useState(false);
  const faqs = (api.data || []).filter((f) => f.approvedAt);
  const auth = useAuth();

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
      <QuestionDialog
        open={openNewQuestionDialog}
        setOpen={setOpenNewQuestionDialog}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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
        {auth.user && (
          <Button
            variant="contained"
            onClick={() => setOpenNewQuestionDialog(true)}
          >
            Submit Question
          </Button>
        )}
      </Box>

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

function QuestionDialog({ open, setOpen }) {
  const api = useApi({ url: "/faqs", method: "post" });
  const [data, setData] = useState({ question: "" });
  const auth = useAuth();
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="md"
      component={"form"}
      onSubmit={async (e) => {
        e.preventDefault();

        const response = await api.call({
          data: { ...data, userId: auth.user.id },
        });

        if (response.ok) {
          setOpen(false);
        }
      }}
    >
      <DialogTitle>New Question</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          The response for your questions will be answered on your email.
        </Typography>
        <TextField
          label="Question"
          multiline
          rows={2}
          fullWidth
          value={data.question}
          onChange={(e) => {
            setData({ ...data, question: e.target.value });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
