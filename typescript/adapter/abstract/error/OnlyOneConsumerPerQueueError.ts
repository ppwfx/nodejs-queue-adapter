export class OnlyOneConsumerPerQueueError extends Error {
    message: "Only one consumer allowed per Queue"
}