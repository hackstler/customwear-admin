import { AwilixContainer } from 'awilix';
import handleOrderPlaced, { config as orderPlacedConfig } from '../subscribers/order-placed';

export default (container, config) => {
  const eventBusService = container.resolve("eventBusService");
  eventBusService.subscribe(orderPlacedConfig.event, handleOrderPlaced);
};