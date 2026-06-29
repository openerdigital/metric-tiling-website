// components/AutoContentForm.tsx
// dnd-kit
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext as SC,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@primitives";
import React from "react";
import type { ComponentType, PropsWithChildren } from "react";
import { useFieldArray } from "react-hook-form";
import type { Node } from "src/lib/buildManifest";
import { type FieldKind, labelFromKey } from "src/lib/inferFieldKind";

import { ContentButton } from "./ContentButton";
import ContentTextInput from "./ContentTextInput";
import { MediaUploadField } from "./MediaUploadField";

const SortableContext = SC as unknown as ComponentType<
  PropsWithChildren<{ items: any; strategy?: any }>
>;
/**
 * Tiny runtime inference for nested group recursion
 */
function inferFromRuntime(key: string, value: any): FieldKind {
  if (Array.isArray(value))
    return value.length === 0 || typeof value[0] === "string"
      ? "stringList"
      : "repeater";
  if (value && typeof value === "object") return "group";
  const k = key.toLowerCase();
  if (k === "video") return "url";
  if (k.includes("graphic")) return "media";
  if (k.includes("video")) return "media:video";
  if (k.includes("image")) return "media:image";
  return "text";
}

/**
 * Small drag handle used by Sortable items (dnd-kit).
 */
function DragHandle({
  listeners,
  attributes,
}: {
  listeners: any;
  attributes: any;
}) {
  return (
    <button
      type="button"
      className="absolute left-0 top-0 grid h-4 w-4 cursor-grab place-items-center border border-[var(--color-cms-form-border)] bg-[var(--color-cms-sidebar-item-bg)] text-[var(--color-cms-sidebar-item-text)] transition-colors duration-150 hover:bg-[var(--color-cms-sidebar-item-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cms-form-ring)] active:cursor-grabbing"
      title="Drag to reorder"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <Icon name="drag" className="size-[18px]" />
    </button>
  );
}

/**
 * Sortable wrapper for each repeater card.
 * Important: we use RHF field's `id` as the dnd-kit item id.
 */
function SortableRepeaterItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // helps avoid accidental text selection while dragging
    touchAction: "none",
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-300 relative grid shrink-0 gap-1 overflow-hidden rounded-[12px] border border-[var(--color-cms-form-border)] bg-[var(--color-cms-form-input-bg)] p-2 pt-5"
    >
      <DragHandle attributes={attributes} listeners={listeners} />
      {children}
    </div>
  );
}

/**
 * Shared renderer for all leaf field controls.
 */
function FieldControl({
  keyName,
  fieldKind,
  path,
  register,
  setValue,
  getValues,
}: {
  keyName: string;
  fieldKind: FieldKind;
  path: string;
  register: any;
  setValue: any;
  getValues: any;
}) {
  const label = labelFromKey(keyName);

  if (
    fieldKind === "media" ||
    fieldKind === "media:image" ||
    fieldKind === "media:video"
  ) {
    let contentType: "image" | "video" | null = null;
    if (fieldKind === "media:video") contentType = "video";
    if (fieldKind === "media:image") contentType = "image";

    return (
      <MediaUploadField
        label={label}
        value={getValues(path)}
        contentType={contentType}
        onUploaded={(file) => setValue(path, file.url, { shouldDirty: true })}
        onDeleted={() => setValue(path, "", { shouldDirty: true })}
      />
    );
  }

  if (fieldKind === "textarea") {
    return (
      <ContentTextInput
        label={label}
        name={path}
        type="textarea"
        register={register}
      />
    );
  }

  if (fieldKind === "url") {
    return (
      <ContentTextInput
        label={label}
        name={path}
        type={keyName.toLowerCase() === "video" ? "text" : "url"}
        register={register}
      />
    );
  }

  return <ContentTextInput label={label} name={path} register={register} />;
}

function StringListNode({
  node,
  control,
  register,
}: {
  node: Extract<Node, { kind: "stringList" }>;
  control: any;
  register: any;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: node.path,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemIds = React.useMemo(
    () => fields.map((f: any) => f.id as string),
    [fields]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    move(oldIndex, newIndex);
  };

  return (
    <div className="grid">
      <h3 className="mb-1 font-bold text-[var(--color-cms-form-label)]">
        {labelFromKey(node.key)}
      </h3>
      <p className="typography-bodySmall mb-1 flex text-[var(--color-cms-form-label)]">
        Drag the <Icon name="drag" className="mx-1 mt-[2px] size-2" />
        icon to reorder the items.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className="-mx-2 flex flex-nowrap gap-1 overflow-auto px-2">
            {fields.map((f: any, idx: number) => (
              <SortableRepeaterItem key={f.id} id={f.id}>
                <ContentTextInput
                  name={`${node.path}.${idx}`}
                  register={register}
                />
                <ContentButton
                  variant="delete"
                  size="small"
                  className="absolute right-0 top-0 rounded-none"
                  onClick={() => remove(idx)}
                  aria-label="Remove item"
                >
                  X
                </ContentButton>
              </SortableRepeaterItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ContentButton variant="add" className="mt-2" onClick={() => append("")}>
        Add Item
      </ContentButton>
    </div>
  );
}

function RepeaterNode({
  node,
  control,
  register,
  setValue,
  getValues,
}: {
  node: Extract<Node, { kind: "repeater" }>;
  control: any;
  register: any;
  setValue: any;
  getValues: any;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: node.path,
  });

  const emptyItem = Object.fromEntries(
    Object.entries(node.itemShape).map(([k, fk]) => [
      k,
      fk.startsWith("media:") ? "" : "",
    ])
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemIds = React.useMemo(
    () => fields.map((f: any) => f.id as string),
    [fields]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    move(oldIndex, newIndex);
  };

  return (
    <div className="grid">
      <h3 className="font-bold text-[var(--color-cms-form-label)]">
        {labelFromKey(node.key)}
      </h3>
      <p className="typography-bodySmall mb-1 flex text-[var(--color-cms-form-label)]">
        Drag the <Icon name="drag" className="mx-1 mt-[2px] size-2" />
        icon to reorder the items.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className="-mx-2 flex flex-nowrap gap-1 overflow-auto px-2">
            {fields.map((f: any, idx: number) => (
              <SortableRepeaterItem key={f.id} id={f.id}>
                {Object.entries(node.itemShape).map(([k, fk]) => (
                  <FieldControl
                    key={k}
                    keyName={k}
                    fieldKind={fk}
                    path={`${node.path}.${idx}.${k}`}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                  />
                ))}

                <ContentButton
                  variant="delete"
                  size="small"
                  className="absolute right-0 top-0 rounded-none"
                  onClick={() => remove(idx)}
                  aria-label="Remove item"
                >
                  X
                </ContentButton>
              </SortableRepeaterItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ContentButton
        variant="add"
        className="mt-2"
        onClick={() => append(emptyItem)}
      >
        Add Item
      </ContentButton>
    </div>
  );
}

function RenderNode({
  node,
  control,
  register,
  setValue,
  getValues,
}: {
  node: Node;
  control: any;
  register: any;
  setValue: any;
  getValues: any;
}) {
  if (node.kind === "field") {
    if (node.fieldKind === "group") {
      const label = labelFromKey(node.key);
      const obj = getValues(node.path);
      const children: Node[] = Object.entries(obj ?? {}).map(([k, v]) => {
        const fk = inferFromRuntime(k as string, v);
        return {
          kind: "field",
          key: k as string,
          path: `${node.path}.${k}`,
          fieldKind: fk,
        };
      });

      return (
        <div className="grid gap-2 border p-2">
          <h3 className="typography-h4">{label}</h3>
          {children.map((child) => (
            <RenderNode
              key={child.path}
              node={child}
              control={control}
              register={register}
              setValue={setValue}
              getValues={getValues}
            />
          ))}
        </div>
      );
    }

    return (
      <FieldControl
        keyName={node.key}
        fieldKind={node.fieldKind}
        path={node.path}
        register={register}
        setValue={setValue}
        getValues={getValues}
      />
    );
  }

  if (node.kind === "stringList") {
    return <StringListNode node={node} control={control} register={register} />;
  }

  if (node.kind === "repeater") {
    return (
      <RepeaterNode
        node={node}
        control={control}
        register={register}
        setValue={setValue}
        getValues={getValues}
      />
    );
  }

  return null;
}

function Section({
  label,
  children,
  id,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id}>
      <h2 className="typography-h3 mb-2">{label}</h2>
      <div className="shadow-soft grid gap-2 rounded-[12px] border border-[var(--color-cms-form-border)] bg-[var(--color-cms-form-surface)] p-2">
        {children}
      </div>
    </div>
  );
}

export function AutoContentForm({
  manifest,
  control,
  register,
  setValue,
  getValues,
}: {
  manifest: Node[];
  control: any;
  register: any;
  setValue: any;
  getValues: any;
}) {
  return (
    <div className="space-y-3">
      {manifest.map((section) => {
        if (section.kind !== "section") return null;
        return (
          <Section
            key={section.path}
            id={section.path}
            label={labelFromKey(section.key)}
          >
            {section.children.map((node) => (
              <RenderNode
                key={node.path}
                node={node}
                control={control}
                register={register}
                setValue={setValue}
                getValues={getValues}
              />
            ))}
          </Section>
        );
      })}
    </div>
  );
}
