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
    <VerticalTimeline lineColor="#8B5A2B">
      {journey.map(milestone => (
        <VerticalTimelineElement
          key={milestone.year}
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "#fff",
            color: "#5D3A1A",
            boxShadow: "0 3px 0 #8B5A2B"
          }}
          contentArrowStyle={{ borderRight: "7px solid #fff" }}
          date={milestone.year}
          dateClassName="text-[#5D3A1A] font-bold"
          iconStyle={{ background: "#5D3A1A", color: "#fff" }}
          icon={<AccessTimeIcon />}
        >
          <h3 className="text-xl font-semibold font-display text-[#5D3A1A] mb-3">
            {milestone.title}
          </h3>
          <p className="text-[#8B5A2B] leading-relaxed font-open-sans">
            {milestone.description}
          </p>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
}
