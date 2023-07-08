/** @module analyses/findKeywordInFirstParagraph */

import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";

import { isEmpty, reject } from "lodash-es";

/**
 * Checks if the introductory paragraph contains keyphrase or synonyms.
 * First splits the first paragraph by sentences. Finds the first paragraph which contains sentences e.g., not an image).
 * (1) Tries to find all (content) words from the keyphrase or a synonym phrase within one sentence.
 * If found all words within one sentence, returns an object with foundInOneSentence = true and keyphraseOrSynonym = "keyphrase"
 * or "synonym".
 * If it did not find all words within one sentence, goes ahead with matching the keyphrase with the entire first paragraph.
 * (2) Tries to find all (content) words from the keyphrase or a synonym phrase within the paragraph.
 * If found all words within the paragraph, returns an object with foundInOneSentence = false, foundInParagraph = true,
 * and keyphraseOrSynonym = "keyphrase" or "synonym".
 * If found not all words within the paragraph of nothing at all, returns an object with foundInOneSentence = false,
 * foundInParagraph = false, and keyphraseOrSynonym = "".
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {Object} Whether the keyphrase words were found in one sentence, whether the keyphrase words were found in
 * the paragraph, whether a keyphrase or a synonym phrase was matched.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const locale = paper.getLocale();

	let paragraphs = paper.getTree().findAll( treeNode => treeNode.name === "p" );
	// Remove empty paragraphs without sentences and paragraphs only consisting of links.
	paragraphs = reject( paragraphs, paragraph => paragraph.sentences.length === 0 );
	paragraphs = reject( paragraphs, paragraph => paragraph.childNodes.every( node => node.name === "a" ) );
	const firstParagraph = paragraphs[ 0 ];

	const result = {
		foundInOneSentence: false,
		foundInParagraph: false,
		keyphraseOrSynonym: "",
	};

	if ( isEmpty( firstParagraph ) ) {
		return result;
	}

	const sentences = firstParagraph.sentences.map( sentence => sentence.text );
	// Use both keyphrase and synonyms to match topic words in the first paragraph.
	const useSynonyms = true;

	if ( ! isEmpty( sentences ) ) {
		const firstResultSentence = sentences
			.map( sentence => findTopicFormsInString( topicForms, sentence, useSynonyms, locale, matchWordCustomHelper ) )
			.find( resultSentence => resultSentence.percentWordMatches === 100 );

		if ( firstResultSentence ) {
			result.foundInOneSentence = true;
			result.foundInParagraph = true;
			result.keyphraseOrSynonym = firstResultSentence.keyphraseOrSynonym;
			return result;
		}

		const resultParagraph = findTopicFormsInString( topicForms, firstParagraph.innerText(), useSynonyms, locale, matchWordCustomHelper );
		if ( resultParagraph.percentWordMatches === 100 ) {
			result.foundInParagraph = true;
			result.keyphraseOrSynonym = resultParagraph.keyphraseOrSynonym;
			return result;
		}
	}

	return result;
}
