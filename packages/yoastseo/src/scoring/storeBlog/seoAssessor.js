import { inherits } from "util";

import { Assessor, assessments, helpers } from "yoastseo";
const { createAnchorOpeningTag } = helpers;

const {
	KeyphraseLengthAssessment,
	MetaDescriptionKeywordAssessment,
	KeyphraseInSEOTitleAssessment,
	SlugKeywordAssessment,
	MetaDescriptionLengthAssessment,
	PageTitleWidthAssessment,
	FunctionWordsInKeyphraseAssessment,
} = assessments.seo;
/**
 * Creates the Assessor
 *
 * @param {Researcher}  researcher   The researcher to use for the analysis.
 * @param {Object?}  options         The options for this assessor.
 * @param {Function}  options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const StoreBlogSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "storeBlogSEOAssessor";

	this._assessments = [
		new KeyphraseLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ),
		new MetaDescriptionLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new KeyphraseInSEOTitleAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new PageTitleWidthAssessment( {
			scores: {
				widthTooShort: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify52" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify53" ),
		}, true ),
		new SlugKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
		} ),
		new FunctionWordsInKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
	];
};

inherits( StoreBlogSEOAssessor, Assessor );

export default StoreBlogSEOAssessor;
