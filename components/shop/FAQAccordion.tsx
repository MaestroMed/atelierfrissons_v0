import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: readonly FAQItem[];
  className?: string;
  /** Open par défaut le premier item. */
  openFirst?: boolean;
}

export function FAQAccordion({ items, className, openFirst = false }: FAQAccordionProps) {
  if (items.length === 0) return null;
  // Base UI accordion : defaultValue est toujours un array (singleton ou multi).
  const defaultValue = openFirst ? ['item-0'] : [];
  return (
    <Accordion defaultValue={defaultValue} className={cn('w-full', className)}>
      {items.map((item, i) => (
        <AccordionItem key={`item-${i}`} value={`item-${i}`} className="border-encre/10 border-b">
          <AccordionTrigger className="font-display hover:text-or-dark py-5 text-left text-lg font-medium md:text-xl">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-encre/80 pb-5 text-base leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
