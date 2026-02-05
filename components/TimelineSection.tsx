"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type Journey = {
  year: string;
  title: string;
  description: string;
};

type TimelineSectionProps = {
  journey: Journey[];
};

export default function TimelineSection({ journey }: TimelineSectionProps) {
  return (
    <VerticalTimeline lineColor="var(--brown-medium)">
      {journey.map(milestone => (
        <VerticalTimelineElement
          key={milestone.year}
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "#fff",
            color: "var(--brown-dark)",
            boxShadow: "0 3px 0 var(--brown-medium)"
          }}
          contentArrowStyle={{ borderRight: "7px solid #fff" }}
          date={milestone.year}
          dateClassName="text-brown-dark font-bold"
          iconStyle={{ background: "var(--brown-dark)", color: "#fff" }}
          icon={<AccessTimeIcon />}
        >
          <h3 className="text-xl font-semibold font-display text-brown-dark mb-3">
            {milestone.title}
          </h3>
          <p className="text-brown-medium leading-relaxed font-open-sans">
            {milestone.description}
          </p>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
}
