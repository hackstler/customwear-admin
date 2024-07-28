import {
  OrderService,
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/medusa";

type OrderPlacedEvent = {
  id: string;
  no_notification: boolean;
};

export default async function orderPlacedHandler({
  data,
  eventName,
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  console.log("🚀 ~ data:", data);
  console.log("🚀 ~ eventName:", eventName);
  const orderService: OrderService = container.resolve("orderService");
  const sendGridService = container.resolve("sendgridService");

  const order = await orderService.retrieve(data.id, {
    relations: ["items", "customer"],
  });
  console.log("🚀 ~ order:", order);

  await sendGridService.sendEmail({
    templateId: process.env.SENDGRID_ORDER_PLACED_ID,
    from: process.env.SENDGRID_FROM,
    to: order.email,
    dynamic_template_data: {
      nombre_cliente: order.customer.first_name,
      articulos: order.items.map((item) => ({
        nombre: item.title,
        cantidad: item.quantity,
        precio: item.unit_price / 100, // Ajustar según sea necesario
      })),
      total: order.total / 100, // Ajustar según sea necesario
    },
  });
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
};
