import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../specHelpers/factory";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import Sentence from "../../../src/parse/structure/Sentence";

const researcher = Factory.buildMockResearcher( {}, true, false, false,
	{ memoizedTokenizer: memoizedSentenceTokenizer } );

describe( "A test for the LanguageProcessor object", () => {
	it( "should correctly create a simple LanguageProcessor object", function() {
		expect( new LanguageProcessor( researcher ) ).toEqual( { researcher: researcher } );
	} );
} );

describe( "A test for the splitIntoSentences method", () => {
	it( "should return an array of sentence objects", function() {
		const languageProcessor = new LanguageProcessor( researcher );

		const sentences = languageProcessor.splitIntoSentences( "Hello, world! Hello, Yoast!" );
		expect( sentences ).toEqual( [ { text: "Hello, world!", sourceCodeRange: {}, tokens: [] },
			{ text: " Hello, Yoast!", sourceCodeRange: {}, tokens: [] } ] );
	} );
	it( "the last sentence should not consist of a whitespace if the text ends in a whitespace", function() {
		const languageProcessor = new LanguageProcessor( researcher );

		const sentences = languageProcessor.splitIntoSentences( "Hello, world! Hello, Yoast! " );
		expect( sentences ).toEqual( [ { text: "Hello, world!", sourceCodeRange: {}, tokens: [] },
			{ text: " Hello, Yoast!", sourceCodeRange: {}, tokens: [] }  ] );
	} );
} );


const splitIntoTokensTestCases = [
	{
		description: "should return an empty array if the sentence is empty",
		sentence: "",
		expectedTokens: [],
	},
	{
		description: "should correctly tokenize a sentence with a single token",
		sentence: "Hello",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a single token and a trailing whitespace",
		sentence: "Hello ",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
		],

	},
	{
		description: "should correctly tokenize a sentence with a single token and a leading whitespace",
		sentence: " Hello",
		expectedTokens: [
			{ text: " ", sourceCodeRange: {} },
			{ text: "Hello", sourceCodeRange: {} },
		],

	},
	{
		description: "should correctly tokenize a sentence with multiple tokens ending with a full stop",
		sentence: "Hello, world.",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: ".", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with multiple tokens ending with a full stop and a trailing whitespace",
		sentence: "Hello, world. ",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: ".", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with multiple punctuation marks",
		sentence: "Hello, world!!!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with multiple different punctuation marks",
		sentence: "Hello, world!?!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
			{ text: "?", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a word containing a dash",
		sentence: "Hello, world-wide!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world-wide", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a word containing an underscore",
		sentence: "Hello, world_wide!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world_wide", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a word containing a forward slash",
		sentence: "Hello, world/worlds!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "/", sourceCodeRange: {} },
			{ text: "worlds", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence with a word containing a backslash",
		sentence: "Hello, world\\worlds!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "\\", sourceCodeRange: {} },
			{ text: "worlds", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence with a word containing an apostrophe",
		sentence: "Hello, world's!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world's", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a number with a decimal point",
		sentence: "Hello, 3.14!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "3.14", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a number with a decimal comma",
		sentence: "Hello, 3,14!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "3,14", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a token that starts with a punctuation mark",
		sentence: "Hello, .world!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: ".", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a token between parentheses",
		sentence: "Hello, (world)!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "(", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: ")", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a phrase between parentheses",
		sentence: "Hello, (world of worlds)!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "(", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "of", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "worlds", sourceCodeRange: {} },
			{ text: ")", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with nested parentheses",
		sentence: "Hello, (world (of worlds))!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "(", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "(", sourceCodeRange: {} },
			{ text: "of", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "worlds", sourceCodeRange: {} },
			{ text: ")", sourceCodeRange: {} },
			{ text: ")", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence containing an url",
		sentence: "Hello, https://www.google.com!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "https://www.google.com", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence containing an email address",
		sentence: "Hello, hugo@yoast.com!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "hugo@yoast.com", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a nbsp",
		sentence: "Hello,\u00A0world!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: "\u00A0", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence where a punctuation mark is between two spaces",
		sentence: "Hello , world!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a german sentence that contains a word with an umlaut",
		sentence: "Hallo, w\u00F6rld!",
		expectedTokens: [
			{ text: "Hallo", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "w\u00F6rld", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a token that contains a number",
		sentence: "Hello, 123world!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "123world", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence with a token that contains an abbreviation",
		sentence: "Hello, W.O.R.L.D.!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "W.O.R.L.D.", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence with a token that contains an emoji",
		sentence: "Hello, 🌍!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "🌍", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence in a language with non latin characters (cyrillic)",
		sentence: "Привет, мир!",
		expectedTokens: [
			{ text: "Привет", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "мир", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence in a LTR language (arabic)",
		sentence: "مرحبا بالعالم!",
		expectedTokens: [
			{ text: "مرحبا", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "بالعالم", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence in a RTL language (arabic) where there is a punctuation mark before and after a word",
		sentence: "مرحبا، ?بالعالم!",
		expectedTokens: [
			{ text: "مرحبا", sourceCodeRange: {} },
			{ text: "،", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "?", sourceCodeRange: {} },
			{ text: "بالعالم", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
	{
		description: "should correctly tokenize a sentence containing right-to-left marks",
		sentence: "Hello \u200Fright-to-left\u200E mark!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "\u200F", sourceCodeRange: {} },
			{ text: "right-to-left", sourceCodeRange: {} },
			{ text: "\u200E", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "mark", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence containing a word that is right-to-left",
		sentence: "Hello, \u200Fمرحبا\u200E!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "\u200F", sourceCodeRange: {} },
			{ text: "مرحبا", sourceCodeRange: {} },
			{ text: "\u200E", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
		skip: true,
	},
	{
		description: "should correctly tokenize a sentence that contains multiple consecutive spaces",
		sentence: "Hello,   world!",
		expectedTokens: [
			{ text: "Hello", sourceCodeRange: {} },
			{ text: ",", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: " ", sourceCodeRange: {} },
			{ text: "world", sourceCodeRange: {} },
			{ text: "!", sourceCodeRange: {} },
		],
	},
];

describe.each( splitIntoTokensTestCases )( "A test for the tokenize method", ( { description, sentence, expectedTokens, skip } ) => {
	const test = skip ? it.skip : it;

	test( description, function() {
		const languageProcessor = new LanguageProcessor( researcher );

		const tokens = languageProcessor.splitIntoTokens( new Sentence( sentence ) );
		expect( tokens ).toEqual( expectedTokens );
	} );
} );
