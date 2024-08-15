import React from "react";
// eslint-disable-next-line import/named
import { DraggableAttributes } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type DnDKitSortableItemProps = {
  id: string;
  render: (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listeners: any;
    attributes: DraggableAttributes;
  }) => React.ReactNode;
  className?: string;
};

export default function DnDKitSortableItem(props: DnDKitSortableItemProps) {
  const { render, id, className = "" } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {render({ listeners, attributes })}
    </div>
  );
}
