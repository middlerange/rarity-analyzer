import { EventEmitter } from "events";
import { RESTOptions } from "./rest";
import { DefaultRestOptions, RouteData, DefaultUserAgent } from "./constants";
import { Agent } from "https";

const agent = new Agent({ keepAlive: true });

/**
 * Represents possible data to be given to an endpoint
 */
export interface RequestData {
	/**
	 * If this request needs the `Authorization` header
	 * @default true
	 */
	auth?: boolean;
	/**
	 * The authorization prefix to use for this request, useful if you use this with bearer tokens
	 * @default 'Bot'
	 */
	authPrefix?: "Bot" | "Bearer";
	/**
	 * The body to send to this request
	 */
	body?: unknown;
	/**
	 * Additional headers to add to this request
	 */
	headers?: Record<string, string>;
	/**
	 * Query string parameters to append to the called endpoint
	 */
	query?: URLSearchParams;
	/**
	 * Reason to show in the audit logs
	 */
	reason?: string;
	/**
	 * If this request should be versioned
	 * @default true
	 */
	versioned?: boolean;
}

export type RouteLike = `/${string}`;

/**
 * Internal request options
 *
 * @internal
 */
export interface InternalRequest extends RequestData {
	method: RequestMethod;
	fullRoute: RouteLike;
}

/**
 * Possible API methods to be used when doing requests
 */
export const enum RequestMethod {
	Delete = "delete",
	Get = "get",
	Patch = "patch",
	Post = "post",
	Put = "put",
}

/**
 * Represents the class that manages handlers for endpoints
 */
export class RequestManager extends EventEmitter {
	/**
	 * A timeout promise that is set when we hit the global rate limit
	 * @default null
	 */
	public globalTimeout: Promise<void> | null = null;

	// @ts-ignore
	#token: string | null = null;

	public readonly options: RESTOptions;

	public constructor(options: Partial<RESTOptions>) {
		super();
		this.options = { ...DefaultRestOptions, ...options };
		this.options.offset = Math.max(0, this.options.offset);
	}

	/**
	 * Sets the authorization token that should be used for requests
	 * @param token The authorization token to use
	 */
	public setToken(token: string) {
		this.#token = token;
		return this;
	}

	/**
	 * Queues a request to be sent
	 * @param request All the information needed to make a request
	 * @returns The response from the api request
	 */
	public async queueRequest(request: InternalRequest): Promise<unknown> {
		const { url, fetchOptions } = this.resolveRequest(request);

		// Queue the request
		return fetch(url, fetchOptions);
	}

	/**
	 * Formats the request data to a usable format for fetch
	 * @param request The request data
	 */
	private resolveRequest(request: InternalRequest): {
		url: string;
		fetchOptions: RequestInit;
	} {
		const { options } = this;

		let query = "";

		// If a query option is passed, use it
		if (request.query) {
			query = `?${request.query.toString()}`;
		}

		// Create the required headers
		const headers: RequestHeaders = {
			"User-Agent": `${DefaultUserAgent} ${options.userAgentAppendix}`.trim(),
		};

		// If this request requires authorization (allowing non-"authorized" requests for webhooks)
		if (request.auth !== false) {
			// If we haven't received a token, throw an error
			if (!this.#token) {
				throw new Error(
					"Expected token to be set for this request, but none was present"
				);
			}

			headers.Authorization = `${request.authPrefix ?? "Bot"} ${this.#token}`;
		}

		// If a reason was set, set it's appropriate header
		if (request.reason?.length) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(request.reason);
		}

		// Format the full request URL (api base, optional version, endpoint, optional querystring)
		const url = `${options.api}${
			request.versioned === false ? "" : `/v${options.version}`
		}${request.fullRoute}${query}`;

		let finalBody: RequestInit["body"];
		let additionalHeaders: Record<string, string> = {};

		if (request.body != null) {
			// Stringify the JSON data
			finalBody = JSON.stringify(request.body);
			// Set the additional headers to specify the content-type
			additionalHeaders = { "Content-Type": "application/json" };
		}

		const fetchOptions = {
			agent,
			body: finalBody,
			headers: {
				...(request.headers ?? {}),
				...additionalHeaders,
				...headers,
			} as Record<string, string>,
			method: request.method,
		};

		return { url, fetchOptions };
	}
}

/**
 * Possible headers for an API call
 */
export interface RequestHeaders {
	Authorization?: string;
	"User-Agent": string;
	"X-Audit-Log-Reason"?: string;
}
