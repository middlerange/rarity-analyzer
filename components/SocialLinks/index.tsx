import * as React from "react";
import {
	DiscordIcon,
	InstagramIcon,
	TwitterIcon,
	WebsiteLinkIcon,
} from "../Icons";

const SocialLinks = () => {
	return (
		<div className="mt-2">
			<ul className="flex space-x-5">
				<li>
					<a
						href={process.env.NEXT_PUBLIC_WEBSITE_URL}
						className="text-gray-500 hover:text-gray-500"
					>
						<span className="sr-only">Website</span>
						<WebsiteLinkIcon />
					</a>
				</li>
				<li>
					<a
						href={process.env.NEXT_PUBLIC_DISCORD}
						className="text-gray-500 hover:text-gray-500"
					>
						<span className="sr-only">Discord</span>
						<DiscordIcon />
					</a>
				</li>
				<li>
					<a
						href={process.env.NEXT_PUBLIC_TWITTER}
						className="text-gray-500 hover:text-gray-500"
					>
						<span className="sr-only">Twitter</span>
						<TwitterIcon />
					</a>
				</li>
				<li>
					<a
						href={process.env.NEXT_PUBLIC_INSTAGRAM}
						className="text-gray-500 hover:text-gray-500"
					>
						<span className="sr-only">Twitter</span>
						<InstagramIcon />
					</a>
				</li>
			</ul>
		</div>
	);
};

export default SocialLinks;
