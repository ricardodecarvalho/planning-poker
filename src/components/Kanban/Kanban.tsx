import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Board, Card, Column } from "./Kanban.styles";

const kanbanBoard = {
  id: "board_001",
  title: "Projeto Website",
  description: "Board para gerenciar o desenvolvimento do novo website",

  lists: [
    {
      id: "list_001",
      title: "Backlog",
      position: 0,
      cards: [
        {
          id: "card_001",
          title: "Criar página inicial",
          description:
            "Desenvolver a página inicial do website com layout responsivo e otimizado para SEO",
          position: 0,
        },
      ],
    },

    {
      id: "list_002",
      title: "To do",
      position: 1,
      cards: [
        {
          id: "card_002",
          title: "Implementar sistema de login",
          description: "Criar sistema de autenticação com JWT",
          position: 0,
        },
      ],
    },

    {
      id: "list_003",
      title: "Doing",
      position: 2,
      cards: [],
    },

    {
      id: "list_004",
      title: "Done",
      position: 3,
      cards: [
        {
          id: "card_003",
          title: "Configurar ambiente de desenvolvimento",
          description: "Configurar Node.js, npm e dependências do projeto",
          position: 0,
        },
      ],
    },
  ],
};

// Componente para cards arrastáveis
interface SortableCardProps {
  card: {
    id: string;
    title: string;
    description: string;
    position: number;
  };
}

const SortableCard = ({ card }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-group-item"
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">{card.title}</div>
        {card.description}
      </div>
    </Card>
  );
};

// Componente para colunas que aceitam drop
interface DroppableColumnProps {
  list: {
    id: string;
    title: string;
    position: number;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      position: number;
    }>;
  };
}

const DroppableColumn = ({ list }: DroppableColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: list.id,
  });

  const style = {
    backgroundColor: isOver ? '#e9ecef' : undefined,
  };

  return (
    <Column 
      ref={setNodeRef} 
      style={style} 
      className="list-group text-bg-light"
    >
      <h5>{list.title}</h5>
      <SortableContext
        items={list.cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        {list.cards.map((card) => (
          <SortableCard key={card.id} card={card} />
        ))}
      </SortableContext>
    </Column>
  );
};

const Kanban = () => {
  const [kanbanBoardState, setKanbanBoardState] = useState(kanbanBoard);
  const [activeCard, setActiveCard] = useState<{
    id: string;
    title: string;
    description: string;
    position: number;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findCardById = (id: string) => {
    for (const list of kanbanBoardState.lists) {
      const card = list.cards.find((card) => card.id === id);
      if (card) return card;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = findCardById(event.active.id as string);
    setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the containers
    const activeContainer = kanbanBoardState.lists.find((list) =>
      list.cards.some((card) => card.id === activeId)
    );
    
    const overContainer = kanbanBoardState.lists.find((list) =>
      list.id === overId || list.cards.some((card) => card.id === overId)
    );

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setKanbanBoardState((prev) => {
      const activeItems = activeContainer.cards;
      const overItems = overContainer.cards;

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      let newIndex;
      if (overId in overItems) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          overIndex < overItems.length &&
          event.delta.y > 0;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      const newLists = prev.lists.map((list) => {
        if (list.id === activeContainer.id) {
          return {
            ...list,
            cards: list.cards.filter((card) => card.id !== activeId),
          };
        } else if (list.id === overContainer.id) {
          const newCards = [...list.cards];
          newCards.splice(newIndex, 0, activeItems[activeIndex]);
          return {
            ...list,
            cards: newCards,
          };
        }
        return list;
      });

      return {
        ...prev,
        lists: newLists,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveCard(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = kanbanBoardState.lists.find((list) =>
      list.cards.some((card) => card.id === activeId)
    );

    if (!activeContainer) {
      setActiveCard(null);
      return;
    }

    const activeIndex = activeContainer.cards.findIndex((card) => card.id === activeId);
    const overIndex = activeContainer.cards.findIndex((card) => card.id === overId);

    if (activeIndex !== overIndex) {
      setKanbanBoardState((prev) => {
        const newLists = prev.lists.map((list) => {
          if (list.id === activeContainer.id) {
            const newCards = [...list.cards];
            const [reorderedItem] = newCards.splice(activeIndex, 1);
            newCards.splice(overIndex, 0, reorderedItem);
            return {
              ...list,
              cards: newCards,
            };
          }
          return list;
        });

        return {
          ...prev,
          lists: newLists,
        };
      });
    }

    setActiveCard(null);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h2>Kanban board</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3>{kanbanBoardState.title}</h3>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Board>
              {kanbanBoardState.lists.map((list) => (
                <DroppableColumn key={list.id} list={list} />
              ))}
            </Board>

            <DragOverlay>
              {activeCard ? (
                <Card className="list-group-item">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{activeCard.title}</div>
                    {activeCard.description}
                  </div>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Kanban;
