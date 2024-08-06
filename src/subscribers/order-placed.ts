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
  const orderService: OrderService = container.resolve("orderService");
  const sendGridService = container.resolve("sendgridService");

  const order = await orderService.retrieve(data.id, {
    relations: ["items", "customer"],
  });
  console.log(order)

  const formattedItems = order.items.map((item) => ({
    imagen: item.thumbnail,
    nombre: item.title,
    cantidad: item.quantity,
    precio: (item.unit_price / 100).toFixed(2),

  }));

const ordertotal:number[] = formattedItems.map(item => +item.precio)
  const InitialValue= 0
  const total = ordertotal.reduce((acc, precio)=> acc + precio, InitialValue)

  console.log("🚀 ~ order.customer.first_name:", order.customer.first_name);

  await sendGridService.sendEmail({
    templateId: process.env.SENDGRID_ORDER_PLACED_ID,
    from: process.env.SENDGRID_FROM,
    to: order.email,
    dynamic_template_data: {
      nombre_cliente: order.customer.first_name,
      articulos: formattedItems,
      total
    },
  });
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
};
