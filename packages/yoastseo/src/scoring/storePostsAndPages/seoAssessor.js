import { inherits } from "util";

import { Assessor, assessments, helpers } from "yoastseo";
const { createAnchorOpeningTag } = helpers;

const {
	IntroductionKeywordAssessment,
	KeyphraseLengthAssessment,
	KeywordDensityAssessment,
	MetaDescriptionKeywordAssessment,
	KeyphraseInSEOTitleAssessment,
	SlugKeywordAssessment,
	MetaDescriptionLengthAssessment,
	TextLengthAssessment,
	PageTitleWidthAssessment,
	FunctionWordsInKeyphraseAssessment,
	SingleH1Assessment,
	OutboundLinksAssessment,
	InternalLinksAssessment,
	ImageCountAssessment,
	ImageKeyphraseAssessment,
	TextCompetingLinksAssessment,
	SubheadingsKeywordAssessment,
} = assessments.seo;

/**
 * Creates the Assessor
 *
 * @param {Researcher}  researcher    The researcher to use for the analysis.
 * @param {Object?}  options          The options for this assessor.
 * @param {Function}  options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const StorePostsAndPagesSEOAssessor = function( researcher,  options ) {
	Assessor.call( this, researcher, options );
	this.type = "storePostsAndPagesSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} ),
		new KeyphraseLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new KeywordDensityAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify12" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify13" ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ),
		new MetaDescriptionLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new SubheadingsKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify16" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify17" ),
		} ),
		new TextCompetingLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify18" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify19" ),
		} ),
		new ImageKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify22" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify23" ),
		} ),
		new ImageCountAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify20" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify21" ),
		} ),
		new TextLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
		} ),
		new OutboundLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify62" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify63" ),
		} ),
		new KeyphraseInSEOTitleAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new InternalLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify60" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify61" ),
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
		new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify54" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify55" ),
		} ),
	];
};

inherits( StorePostsAndPagesSEOAssessor, Assessor );

export default StorePostsAndPagesSEOAssessor;
