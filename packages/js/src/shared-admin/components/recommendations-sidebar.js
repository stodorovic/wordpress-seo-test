import PropTypes from "prop-types";

/**
 * @param {JSX.Node} children The content.
 * @returns {JSX.Element} The recommendations sidebar.
 */
export const RecommendationsSidebar = ( { children } ) => (
	<div className="xl:yst-max-w-3xl xl:yst-fixed xl:yst-right-8 xl:yst-w-[16rem]">
		<div className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-1 yst-gap-4">
			{ children }
		</div>
	</div>
);

RecommendationsSidebar.propTypes = {
	children: PropTypes.node.isRequired,
};
