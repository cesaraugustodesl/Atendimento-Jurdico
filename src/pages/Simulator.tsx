import SimulatorExperience from "./SimulatorExperience";
import { getSimulatorBySlug } from "../lib/simulators/registry";

interface SimulatorProps {
  onNavigate: (href: string) => void;
}

export default function Simulator({ onNavigate }: SimulatorProps) {
  return (
    <SimulatorExperience
      simulator={getSimulatorBySlug("trabalhista-geral")!}
      onNavigate={onNavigate}
    />
  );
}
