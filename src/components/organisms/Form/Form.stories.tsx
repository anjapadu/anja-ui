import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, type Layout } from "./Form";
import { z } from "zod";
import { createDefaultRenderers } from "./renderers";
import { FormButton } from "../../atoms/Button";

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
      email: z.email(),
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
      items: [{ label: "Gustavo Yance", value: "gyance" }],
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
        label: "Technologies used",
        checkboxAppearance: "box",
        spacing: "default",
        showSelectControls: true,
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
          showDebugFormValues
          schema={schema}
          layout={layout}
          renderers={createDefaultRenderers<FormData>({
            defaults: {
              input: { labelBehavior: "floating" },
              combobox: { label: "floating" },
            },
          })}
        />
      </div>
    );
  },
};

const accountSettingsSchema = z.object({
  // personalInformation: z.object({
  //   email: z.email(),
  //   country: z.string(),
  //   prefferedLanguage: z.string(),
  // }),
  profileDetails: z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    mobilePhone: z.string(),
    biography: z.string().min(100).max(1000),
    termsAndConditions: z.boolean(),
  }),
  // notifications: z.object({
  //   exclusiveProducts: z.boolean().default(false),
  //   news: z.boolean().default(false),
  //   dailyMessage: z.boolean().default(false),
  //   weeklySummary: z.boolean().default(false),
  // }),
});
export type AccountSettingsFormData = z.infer<typeof accountSettingsSchema>;

const accountSettingsLayout: Layout<AccountSettingsFormData> = [
  {
    type: "section",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget eros nibh. Fusce faucibus lacus quis sem egestas, fringilla eleifend massa lacinia. Sed a ante tortor",
    title: "Profile Details",
    blocks: [
      [
        {
          name: "profileDetails.firstName",
          component: "input",
          label: "First name",
          inputProps: {
            placeholder: "Ingresa tu nombre",
          },
        },
        {
          name: "profileDetails.lastName",
          component: "input",
          label: "Last name",
          inputProps: {
            placeholder: "Ingresa tu apellido",
          },
        },
      ],
      [
        {
          name: "profileDetails.username",
          component: "input",
          label: "Username",
          inputProps: {
            placeholder: "Ingresa tu usuario",
          },
        },
        {
          name: "profileDetails.mobilePhone",
          component: "input",
          label: "Phone number",
          inputProps: {
            placeholder: "Ingresa tu teléfono",
          },
        },
      ],
      {
        name: "profileDetails.biography",
        component: "textarea",
        label: "Biography",
        textareaProps: {
          placeholder: "Agrega una biografía.",
          hint: "(No debe tener menos de 100 caracteres)",
        },
      },
      {
        component: "checkbox",
        name: "profileDetails.termsAndConditions",
        containerClassName: "mt-4",
        checkboxProps: {
          label: "Acepto los términos y condiciones",
        },
      },
    ],
  },
];

export const AccountSettings: Story = {
  args: {
    schema,
    layout,
  },
  render: (props) => {
    return (
      <div className="flex flex-col gap-y-2 bg-[#f1f7fa] p-6 w-[100vw] [--input-color-bg:#f1f7fa] dark:[--input-color-bg:var(--color-neutral-50)] dark:bg-blue-950">
        <Form
          {...props}
          schema={accountSettingsSchema}
          layout={accountSettingsLayout}
          onSubmit={(data) => {
            console.log({ data });
          }}
          renderers={createDefaultRenderers({
            defaultDirection: "col",
            defaults: {
              input: { labelBehavior: "floating" },
            },
          })}
        >
          <FormButton variant="primary" className="self-end">
            Registrarse
          </FormButton>
        </Form>
      </div>
    );
  },
};
