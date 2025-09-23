import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, type Layout } from "./Form";
import { z } from "zod";
import { createDefaultRenderers } from "./renderers";

const meta = {
  title: "Organisms/Form",
  component: Form,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
  argTypes: {},
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

const schema = z.object({
  company: z.object({
    legalName: z.string().min(2),
    tradeName: z.string().optional(),
    vat: z.string().regex(/^[0-9]{11}$/),
    size: z.enum(["Micro", "Pyme", "Corporación"]),
  }),

  address: z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
    zip: z.string().min(4),
    line1: z.string().min(5),
  }),

  contacts: z.array(
    z.object({
      fullName: z.string(),
      email: z.string().email(),
      role: z.enum(["Legal", "Finanzas", "Técnico"]),
    })
  ),

  tech: z.object({
    stack: z.array(z.string()).min(1).max(10),
  }),

  prefs: z.object({
    methods: z.array(z.enum(["Tarjeta", "Transferencia", "PayPal"])),
    priority: z.enum(["Alta", "Media", "Baja"]),
    annualBudget: z.number().min(1000).max(100000),
  }),

  consent: z.object({
    terms: z.boolean(),
    sign: z.string().optional(),
  }),
});

export type FormData = z.infer<typeof schema>;

const layout: Layout<FormData> = [
  { title: "Información General" },
  [
    {
      name: "company.legalName",
      component: "input",
      label: "Nombre legal",
    },
    {
      name: "company.tradeName",
      component: "input",
      label: "Nombre comercial",
    },
  ],
  [
    { name: "company.vat", component: "input", label: "RUC/VAT" },
    { name: "company.size", component: "input", label: "Tamaño" },
  ],

  { title: "Dirección" },
  [
    {
      name: "address.country",
      component: "combobox",
      label: "País",
      options: [{ label: "Gustavo Yance", value: "gyance" }],
    },
    { name: "address.state", component: "input", label: "Estado" },
    { name: "address.city", component: "input", label: "Ciudad" },
    { name: "address.zip", component: "input", label: "Código Postal" },
  ],
  [
    {
      name: "tech.stack",
      component: "multicheckbox",
      multiCheckboxProps: {
        label: "Select all",
        checkboxAppearance: "box",
        spacing: "default",
      },
      options: [
        { label: "React", value: "react" },
        { label: "Vue", value: "vue" },
        { label: "Angular", value: "angular" },
        { label: "NodeJS", value: "node" },
        { label: "Postgres", value: "postgres" },
        { label: "MySQL", value: "mysql" },
        { label: "Docker", value: "docker" },
      ],
    },
  ],
  [
    {
      component: "checkbox",
      name: "consent.terms",
      label: "Terms and conditions",
    },
  ],

  // [{ name: "address.line1", component: "textarea", label: "Dirección" }],

  // { title: "Contactos" },
  // {
  //   type: "repeater",
  //   name: "contacts",
  //   template: [
  //     {
  //       name: "contacts[number].fullName",
  //       component: "input",
  //       label: "Nombre",
  //     },
  //     { name: "contacts[number].email", component: "input", label: "Email" },
  //     { name: "contacts[number].role", component: "select", label: "Rol" },
  //   ],
  // },

  // { title: "Stack Tecnológico" },
  // [{ name: "tech.stack", component: "tagpicker", label: "Tecnologías" }],

  // { title: "Preferencias" },
  // [
  //   { name: "prefs.methods", component: "checkbox", label: "Métodos de pago" },
  //   { name: "prefs.priority", component: "select", label: "Prioridad" },
  // ],
  // [{ name: "prefs.annualBudget", component: "slider", label: "Presupuesto" }],

  // { title: "Consentimiento" },
  // [
  //   { name: "consent.terms", component: "checkbox", label: "Acepto términos" },
  //   { name: "consent.sign", component: "input", label: "Firma" },
  // ],
];

export const OnePageForm: Story = {
  args: {
    schema,
    layout,
  },
  render: (props) => {
    return (
      <div className="flex flex-col gap-y-2">
        <Form<FormData>
          {...props}
          schema={schema}
          layout={layout}
          renderers={createDefaultRenderers<FormData>({
            input: { labelBehavior: "floating" },
          })}
        />
      </div>
    );
  },
};
