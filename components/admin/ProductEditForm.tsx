'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Check, Plus, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  productEditSchema,
  type ProductEditInput,
  COLLECTION_OPTIONS,
  STATUS_OPTIONS,
  STOCK_STATUS_OPTIONS,
} from '@/lib/admin/products/schema';
import { updateProductAction } from '@/lib/admin/products/actions';
import { RichTextEditor } from './RichTextEditor';

interface ProductEditFormProps {
  initial: ProductEditInput;
}

/**
 * Formulaire d'édition produit admin — RHF + zod + Server Action.
 *
 * Structure :
 *   - Section 1 : Identification (name, slug, tagline)
 *   - Section 2 : Statut & collection (status, collection, isFeatured)
 *   - Section 3 : Prix & stock
 *   - Section 4 : Descriptions (short + editorial rich-text + long rich-text)
 *   - Section 5 : Tags + features + specs (arrays dynamiques)
 *   - Section 6 : SEO (title, description, keywords)
 *
 * Sticky save bar en bas avec état (idle / pending / success / error).
 * Validation côté client ET serveur (zod partagé).
 */
export function ProductEditForm({ initial }: ProductEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    getValues,
    reset,
  } = useForm<ProductEditInput>({
    resolver: zodResolver(productEditSchema) as never, // RHF v7 + zod v4 generics friction
    defaultValues: initial,
    mode: 'onBlur',
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    // @ts-expect-error RHF ne gère pas bien les arrays de primitifs via useFieldArray
    name: 'tags',
  });
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    // @ts-expect-error — idem, string[] primitive
    name: 'features',
  });
  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    // @ts-expect-error — idem
    name: 'seoKeywords',
  });

  // Les specs sont un Record<string,string>, pas un array — on subscribe via watch
  // pour re-render quand les entries changent (add/remove côté SpecsField).
  // eslint-disable-next-line react-hooks/incompatible-library
  const specsEntries = watch('specs') ?? {};
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const addSpec = () => {
    const key = newSpecKey.trim();
    const value = newSpecValue.trim();
    if (!key || !value) return;
    reset({
      ...getValues(),
      specs: { ...specsEntries, [key]: value },
    });
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const removeSpec = (key: string) => {
    const next = { ...specsEntries };
    delete next[key];
    reset({ ...getValues(), specs: next });
  };

  const onSubmit = (data: ProductEditInput) => {
    setGlobalError(null);
    startTransition(async () => {
      const result = await updateProductAction(data);
      if (!result.ok) {
        setSubmitState('error');
        setGlobalError(result.message ?? 'Erreur serveur');
        toast.error(result.message ?? 'Impossible d’enregistrer');
        return;
      }
      setSubmitState('success');
      toast.success(result.message ?? 'Produit enregistré');
      // Reset dirty flag avec les nouvelles valeurs
      if (result.product) reset(result.product);
      setTimeout(() => setSubmitState('idle'), 2500);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10" noValidate>
      {/* ── Identification ──────────────────────────────────────────── */}
      <AdminSection title="Identification">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nom" error={errors.name?.message} required>
            <input
              {...register('name')}
              type="text"
              className={fieldInputClass}
              aria-invalid={!!errors.name}
            />
          </Field>
          <Field
            label="Slug"
            error={errors.slug?.message}
            hint="Lettres minuscules + tirets"
            required
          >
            <input
              {...register('slug')}
              type="text"
              className={cn(fieldInputClass, 'font-mono text-xs')}
              aria-invalid={!!errors.slug}
            />
          </Field>
          <Field label="Nom court" error={errors.nameShort?.message} className="md:col-span-1">
            <input {...register('nameShort')} type="text" className={fieldInputClass} />
          </Field>
          <Field label="Tagline éditoriale" error={errors.tagline?.message}>
            <input {...register('tagline')} type="text" className={fieldInputClass} />
          </Field>
        </div>
      </AdminSection>

      {/* ── Statut & collection ─────────────────────────────────────── */}
      <AdminSection title="Statut & collection">
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Statut" error={errors.status?.message}>
            <select {...register('status')} className={fieldInputClass}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Collection">
            <select {...register('collection')} className={fieldInputClass}>
              {COLLECTION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sélection signature" hint="Mis en avant sur la home">
            <label className="mt-2 inline-flex items-center gap-2 text-sm">
              <input {...register('isFeatured')} type="checkbox" className="accent-or size-4" />
              <span>Afficher dans la sélection signature</span>
            </label>
          </Field>
        </div>
      </AdminSection>

      {/* ── Prix & stock ────────────────────────────────────────────── */}
      <AdminSection title="Prix et stock">
        <div className="grid gap-5 md:grid-cols-4">
          <Field label="Prix (centimes)" error={errors.priceCents?.message} required>
            <input
              {...register('priceCents')}
              type="number"
              min={0}
              step={1}
              className={cn(fieldInputClass, 'tabular')}
            />
          </Field>
          <Field
            label="Prix barré (centimes)"
            error={errors.compareAtPriceCents?.message}
            hint="Laisser vide si pas de promo"
          >
            <input
              {...register('compareAtPriceCents')}
              type="number"
              min={0}
              step={1}
              className={cn(fieldInputClass, 'tabular')}
            />
          </Field>
          <Field label="Stock" error={errors.stockQuantity?.message}>
            <input
              {...register('stockQuantity')}
              type="number"
              min={0}
              step={1}
              className={cn(fieldInputClass, 'tabular')}
            />
          </Field>
          <Field label="État stock">
            <select {...register('stockStatus')} className={fieldInputClass}>
              {STOCK_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Seuil stock bas" className="md:col-span-1">
            <input
              {...register('lowStockThreshold')}
              type="number"
              min={0}
              step={1}
              className={cn(fieldInputClass, 'tabular')}
            />
          </Field>
        </div>
      </AdminSection>

      {/* ── Descriptions ────────────────────────────────────────────── */}
      <AdminSection title="Descriptions">
        <div className="flex flex-col gap-6">
          <Field
            label="Description courte"
            hint="Paragraphe visible sur la fiche produit + meta description de base."
            error={errors.descriptionShort?.message}
            required
          >
            <textarea
              {...register('descriptionShort')}
              rows={3}
              className={fieldInputClass}
              aria-invalid={!!errors.descriptionShort}
            />
          </Field>

          <Field
            label="Description éditoriale"
            hint="Bodoni italique — section « L'histoire » de la fiche."
            error={errors.descriptionEditorial?.message}
          >
            <Controller
              name="descriptionEditorial"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Le geste qui précède l'objet…"
                />
              )}
            />
          </Field>

          <Field
            label="Description détail produit"
            hint="Texte + listes — section « Conception » de la fiche."
            error={errors.descriptionLong?.message}
          >
            <Controller
              name="descriptionLong"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Composition, matières, dimensions…"
                />
              )}
            />
          </Field>
        </div>
      </AdminSection>

      {/* ── Tags, features, specs ───────────────────────────────────── */}
      <AdminSection title="Attributs">
        <div className="flex flex-col gap-8">
          <StringArrayField
            label="Tags"
            hint="Affichés sur la fiche. Max 20."
            fields={tagFields}
            register={register}
            name="tags"
            onAppend={() => appendTag('')}
            onRemove={removeTag}
          />
          <StringArrayField
            label="Caractéristiques (features)"
            hint="Points clés de la colonne « Conception »."
            fields={featureFields}
            register={register}
            name="features"
            onAppend={() => appendFeature('')}
            onRemove={removeFeature}
          />
          <SpecsField
            entries={specsEntries}
            onAdd={addSpec}
            onRemove={removeSpec}
            newKey={newSpecKey}
            newValue={newSpecValue}
            onNewKeyChange={setNewSpecKey}
            onNewValueChange={setNewSpecValue}
          />
        </div>
      </AdminSection>

      {/* ── SEO ─────────────────────────────────────────────────────── */}
      <AdminSection title="SEO">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="SEO Title"
            error={errors.seoTitle?.message}
            hint="50-60 caractères idéalement"
          >
            <input {...register('seoTitle')} type="text" className={fieldInputClass} />
          </Field>
          <Field
            label="SEO Description"
            error={errors.seoDescription?.message}
            hint="140-160 caractères"
          >
            <textarea {...register('seoDescription')} rows={2} className={fieldInputClass} />
          </Field>
        </div>
        <div className="mt-5">
          <StringArrayField
            label="Mots-clés SEO"
            hint="1-3 mots par entrée. Max 20."
            fields={keywordFields}
            register={register}
            name="seoKeywords"
            onAppend={() => appendKeyword('')}
            onRemove={removeKeyword}
          />
        </div>
      </AdminSection>

      {/* ── Save bar sticky ─────────────────────────────────────────── */}
      <div
        className={cn(
          'border-encre/10 bg-ivoire sticky bottom-0 -mx-8 flex items-center justify-between gap-4 border-t px-8 py-4 md:-mx-12 md:px-12',
          'supports-backdrop-filter:bg-ivoire/92 supports-backdrop-filter:backdrop-blur-sm',
          'z-10',
        )}
      >
        <div className="flex items-center gap-3 text-xs">
          {globalError ? (
            <span className="text-rouge-light inline-flex items-center gap-2">
              <AlertCircle className="size-3.5" aria-hidden="true" />
              {globalError}
            </span>
          ) : isDirty ? (
            <span className="text-encre/60 font-italic-editorial">
              Modifications non enregistrées
            </span>
          ) : submitState === 'success' ? (
            <span className="text-af-success inline-flex items-center gap-2">
              <Check className="size-3.5" aria-hidden="true" strokeWidth={2} />
              Enregistré
            </span>
          ) : (
            <span className="text-encre/45">Aucune modification</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => reset(initial)}
            disabled={!isDirty || isPending}
            className="ui-caps border-encre/20 text-encre/80 hover:border-encre/50 inline-flex items-center gap-2 border px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isDirty || isPending}
            className={cn(
              'ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex items-center gap-2 px-5 py-2.5 transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {isPending ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                Enregistrement…
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" strokeWidth={1.5} />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Helpers visuels ─────────────────────────────────────────────────────
const fieldInputClass = cn(
  'border-encre/20 bg-ivoire text-encre focus:border-or placeholder:text-encre/40',
  'w-full border px-3 py-2 text-sm transition-colors focus:outline-none',
);

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="ui-caps text-or-dark">{title}</h3>
      <div className="border-encre/10 bg-ivoire-light/30 border p-5 md:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  error,
  hint,
  required = false,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean;
  className?: string | undefined;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="ui-caps text-encre/65 text-[10px]">
        {label}
        {required ? <span className="text-rouge-light ml-1">*</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-rouge-light text-xs">
          {error}
        </p>
      ) : hint ? (
        <p className="text-encre/50 text-[11px]">{hint}</p>
      ) : null}
    </div>
  );
}

// ── String array field (tags, features, keywords) ──────────────────────
interface StringArrayFieldProps {
  label: string;
  hint?: string;
  fields: { id: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  name: 'tags' | 'features' | 'seoKeywords';
  onAppend: () => void;
  onRemove: (index: number) => void;
}

function StringArrayField({
  label,
  hint,
  fields,
  register,
  name,
  onAppend,
  onRemove,
}: StringArrayFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="ui-caps text-encre/65 text-[10px]">{label}</p>
      {hint ? <p className="text-encre/50 -mt-1 text-[11px]">{hint}</p> : null}
      <ul className="mt-1 flex flex-wrap gap-2">
        {fields.map((field, i) => (
          <li key={field.id}>
            <div className="border-encre/20 bg-ivoire focus-within:border-or inline-flex items-center gap-1.5 border px-2 py-1">
              <input
                {...register(`${name}.${i}`)}
                type="text"
                className="text-encre placeholder:text-encre/40 w-32 bg-transparent text-xs focus:outline-none"
                placeholder="Entrée…"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label={`Retirer l'entrée ${i + 1}`}
                className="text-encre/55 hover:text-rouge inline-flex size-5 items-center justify-center transition-colors"
              >
                <X className="size-3" aria-hidden="true" strokeWidth={1.5} />
              </button>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={onAppend}
            className="ui-caps border-or/40 text-or-dark hover:border-noir hover:bg-noir hover:text-ivoire inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] transition-colors"
          >
            <Plus className="size-3" aria-hidden="true" strokeWidth={1.5} />
            Ajouter
          </button>
        </li>
      </ul>
    </div>
  );
}

// ── Specs field (Record<string,string>) ─────────────────────────────────
function SpecsField({
  entries,
  onAdd,
  onRemove,
  newKey,
  newValue,
  onNewKeyChange,
  onNewValueChange,
}: {
  entries: Record<string, string>;
  onAdd: () => void;
  onRemove: (key: string) => void;
  newKey: string;
  newValue: string;
  onNewKeyChange: (v: string) => void;
  onNewValueChange: (v: string) => void;
}) {
  const keys = Object.keys(entries);
  return (
    <div className="flex flex-col gap-3">
      <p className="ui-caps text-encre/65 text-[10px]">Caractéristiques (specs)</p>
      <p className="text-encre/50 -mt-1 text-[11px]">
        Paires clé / valeur affichées dans le tableau de la fiche. Ex : « Matière » → « Silicone
        médical ISO 10993 ».
      </p>

      {keys.length > 0 ? (
        <ul className="border-encre/10 divide-encre/8 flex flex-col divide-y border">
          {keys.map((k) => (
            <li key={k} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className="text-encre/65 w-40 shrink-0 truncate">{k}</span>
              <span className="text-encre flex-1 truncate">{entries[k]}</span>
              <button
                type="button"
                onClick={() => onRemove(k)}
                aria-label={`Retirer la spec ${k}`}
                className="text-encre/55 hover:text-rouge inline-flex size-6 items-center justify-center transition-colors"
              >
                <X className="size-3.5" aria-hidden="true" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="border-encre/15 bg-ivoire flex flex-col gap-2 border border-dashed p-3 md:flex-row md:items-center">
        <input
          type="text"
          value={newKey}
          onChange={(e) => onNewKeyChange(e.target.value)}
          placeholder="Clé (ex: Matière)"
          className={cn(fieldInputClass, 'md:w-40')}
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => onNewValueChange(e.target.value)}
          placeholder="Valeur (ex: Silicone ISO 10993)"
          className={cn(fieldInputClass, 'md:flex-1')}
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={!newKey.trim() || !newValue.trim()}
          className={cn(
            'ui-caps bg-noir text-ivoire hover:bg-or hover:text-noir inline-flex shrink-0 items-center justify-center gap-1.5 px-4 py-2 text-[10px] transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          <Plus className="size-3" aria-hidden="true" strokeWidth={1.5} />
          Ajouter
        </button>
      </div>
    </div>
  );
}
