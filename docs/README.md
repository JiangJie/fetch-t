**@happy-ts/fetch-t** • **Docs**

***

# @happy-ts/fetch-t

## Interfaces

| Interface | Description |
| ------ | ------ |
| [FetchInit](interfaces/FetchInit.md) | Extends the standard `RequestInit` interface from the Fetch API to include additional custom options. |
| [FetchTask](interfaces/FetchTask.md) | Defines the structure and behavior of a fetch task, including the ability to abort the task and check its status. |

## Type Aliases

| Type alias | Description |
| ------ | ------ |
| [FetchResponse](type-aliases/FetchResponse.md) | Represents the response of a fetch operation, encapsulating the result data or any error that occurred. |
| [FetchResponseType](type-aliases/FetchResponseType.md) | Specifies the expected response type of the fetch request. |

## Variables

| Variable | Description |
| ------ | ------ |
| [ABORT\_ERROR](variables/ABORT_ERROR.md) | Name of abort error; |
| [TIMEOUT\_ERROR](variables/TIMEOUT_ERROR.md) | Name of timeout error; |

## Functions

| Function | Description |
| ------ | ------ |
| [fetchT](functions/fetchT.md) | Fetches a resource from the network as a text string and returns a `FetchTask` representing the operation. |
