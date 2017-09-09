'use strict'

var trivia = {};

trivia.state = {};

trivia.reset = function () {
	trivia.stopClock();
	$('.clock,.time').show();
	trivia.state = {
		playing: false,
		inning: 1,
		score: 0,
		wins: 0,
		losses: 0,
		unanswered: 0,
		time: 30,
		interval: "",
		questionElement: "#",
		optionsElement: "#options",
		statusElement: "#",
		clockElement: "#clock",
		currentAnswer: null
	}
	$('.scoreboard').hide();
	$('.scoreboard, #options').empty();
	trivia.buildQuestion();
}

trivia.questions = [{
		question: "Which Giant is the all-time homerun leader in MLB history?",
		answer: "Barry Bonds",
		options: ["Barry Bonds", "Buster Posey", "Jeff Kent"]
	},
	{
		question: "Which player is the cove behind AT&T Park named after?",
		answer: "Willie McCovey",
		options: ["Barry Bonds", "Buster Posey", "Willie McCovey"]
	},
	{
		question: "The Giants won the 2010, 2012, 2014 World Series under which manager?",
		answer: "Bruce Bochy",
		options: ["Alvin Dark", "Bruce Bochy", "Leo Durocher"]
	},
	{
		question: "Who did the Giants trade away in 2010 to make room for the future Rookie of the Year, Buster Posey?",
		answer: "Bengie Molina",
		options: ["Barry Zito", "Tom Haller", "Bengie Molina"]
	},
	{
		question: "Who hit the first home run into McCovey Cove?",
		answer: "Barry Bonds",
		options: ["Jeff Kent", "Barry Bonds", "Sammy Sosa"]
	},
	{
		question: "Who played against the Giants in the first official game at Pacific Bell Park?",
		answer: "Los Angeles Dodgers",
		options: ["Milwaukee Brewers", "Montreal Expos", "New York Yankees","Los Angeles Dodgers"]
	},
	{
		question: "The number 30 was retired to honor which former Giant?",
		answer: "Orlando Cepeda",
		options: ["Orlando Cepeda", "Mel Ott", "Juan Marichal","Carl Hubbell"]
	},
	{
		question: "Who was the first player in a Giants unifrom to hit 50 home runs in a single season?",
		answer: "Johnny Mize",
		options: ["Wilie Mays", "Johnny Mize", "Mel Ott","Orlando Cepeda"]
	}
];

trivia.startClock = function (time, speed, isPlaying) {
	trivia.stopClock();
	trivia.state.time = time;
	trivia.state.interval = setInterval(trivia.countDown, speed);
	trivia.state.playing = isPlaying;

	if (trivia.state.playing) {
		console.log("You are playing a game");
	} else {
		console.log("You are NOT playing a game");
	}

	trivia.inningCheck();
}

trivia.countDown = function () {
	trivia.state.time--;
	$(trivia.state.clockElement).text(trivia.state.time);

	if (trivia.state.time <= 0 && trivia.state.playing) {
		trivia.state.playing = false;
		trivia.stopClock();
		trivia.updateScreen(false, true);
	} else if (trivia.state.time <= 0 && !trivia.state.playing) {
		trivia.stopClock();
		trivia.buildQuestion();
	}
};

trivia.stopClock = function () {
	clearInterval(trivia.state.interval);
}

trivia.inningCheck = function () {
	if (trivia.state.inning > trivia.questions.length) {
		trivia.stopClock();
		$('#status, .status img').hide();
		$('#status, .clock').hide();
		$('.scoreboard').show().html(
			'<h3>WINS: ' + trivia.state.wins + '</h3>' +
			'<h3>LOSSES: ' + trivia.state.losses + '</h3>' +
			'<h3>UNANSWERED: ' + trivia.state.unanswered + '</h3>'
		);
		$('button.reset').on("click", trivia.reset);
		$('button.reset').show();
	}
}

trivia.updateScreen = function (win, unanswered) {
	$('#options, #question').empty();
	trivia.state.inning++;

	if (win) {
		trivia.state.wins++;
		trivia.statusImage('win')
		trivia.startClock(4, 1000, false);
		console.log("WINS:", trivia.state.wins);
	} else if (unanswered) {
		trivia.state.unanswered++;
		trivia.statusImage();
		trivia.startClock(4, 1000, false);
		console.log("UNANSWERED:", trivia.state.unanswered);
		$('#status').show();
		$('#status').text("You did not answer the question in time...");
	} else {
		trivia.state.losses++;
		trivia.statusImage();
		trivia.startClock(4, 1000, false);
		console.log("LOSSES:", trivia.state.losses);
	}
}

trivia.buildQuestion = function () {
	var item = null;
	item = trivia.questions[trivia.state.inning - 1];
	trivia.state.playing = true;
	trivia.state.currentAnswer = item.answer;
	console.log("CURRENT ANSWER:", trivia.state.currentAnswer);

	console.log("ITEMS:", item);

	$('#status, .status img').hide();
	$('#clock').text("30");
	$('.time').show();
	$('#question').text(item.question);
	trivia.startClock(30, 1000, true);

	item.options.forEach(function (item) {
		$('#options').append('<a href="#" data-option="' + item + '" class="list-group-item option">' + item + '</a>')
	});

	$('.option').on("click", function () {
		var option = $(this).data().option;
		$(".status img").removeAttr("src");

		if (option === trivia.state.currentAnswer) {
			clearInterval(trivia.state.interval);
			$("#status").text("You are correct!");
			$('#status').show();
			trivia.updateScreen(true);
		} else {
			clearInterval(trivia.state.interval);
			$("#status").html("You are incorrect!<br /> The correct answer is " + trivia.state.currentAnswer);
			$('#status').show();
			trivia.updateScreen(false);
		}
	});

	$('button').hide();
}

$(document).ready(function () {

	$('.question-area, .time, .scorebord').hide();
	$('button.reset').hide();

	$('button.play-ball').on("click", function () {
		$(this).hide();
		$('#options, .question-area').show();
		trivia.reset();
	});

});

trivia.gifs = {
	win: [
		"69zC8Jwd9nsZi",
		"14jmjExFhMRYS4",
		"OzOG7ZkeZ7QbK"
	],
	lose: [
		"jdsyFF2rWIEuY",
		"WM08wsbwHadfa",
		"3o6Zt1TrXW8uW2lE2I"
	]
}

trivia.randomize = function (arr) {
	var numberOfItems = arr.length - 1;
	var min = Math.ceil(0);
	var max = Math.floor(numberOfItems);
	return arr[Math.floor(Math.random() * (max - min + 1)) + min];
}

trivia.statusImage = function (status) {

	var winOrLose = status === 'win' ? trivia.randomize(trivia.gifs.win) : trivia.randomize(trivia.gifs.lose);

	$(".status img").hide().attr("src", "https://media.giphy.com/media/" + winOrLose + "/giphy.gif").show();

}