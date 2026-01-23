import React from "react";

interface QueueViewProps {
  position: number;
  totalInQueue: number;
  onCancel: () => void;
}

export const QueueView: React.FC<QueueViewProps> = ({
  position,
  totalInQueue,
  onCancel,
}) => {
  return (
    <div className="queue-view">
      <div className="queue-spinner"></div>
      <div className="queue-text">Finding opponent...</div>
      <div className="queue-position">
        Position in queue: {position} of {totalInQueue}
      </div>
      <button className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};
