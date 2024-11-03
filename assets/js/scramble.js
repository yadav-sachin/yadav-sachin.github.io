// scramble.js

function scrambledString(tag, objName, initScrambledString, initScrambledStringIndices) {
    this.tag = tag;
    this.objName = objName;
    this.string = initScrambledString;
    this.indices = initScrambledStringIndices;
    this.rescramble = rescramble;
    this.initAnimatedBubbleSort = initAnimatedBubbleSort;
    this.bubbleSortStep = bubbleSortStep;
    this.bubbleSortBookmark = 0;

    this.rescramble();
    // Add the unscramble link
    this.tag.innerHTML = this.string + ' <a href="#" onClick="' + this.objName + '.initAnimatedBubbleSort();return false;">unscramble</a>';
}

function rescramble() {
    for (var i = 0; i < this.indices.length; i++) {
        var indexToMove = Math.floor(Math.random() * (this.indices.length - i));
        var charIndexRemoved = this.indices.splice(indexToMove, 1);
        this.indices = this.indices.concat(charIndexRemoved);
        var scrambledStringTemp = this.string.substring(0, indexToMove) +
            this.string.substring(indexToMove + 1) +
            this.string.substring(indexToMove, indexToMove + 1);
        this.string = scrambledStringTemp;
    }
}

function initAnimatedBubbleSort() {
    var that = this; // Preserve the context
    this.interval = setInterval(function() {
        that.bubbleSortStep();
    }, 12);
}

function bubbleSortStep() {		
    if (this.bubbleSortBookmark >= this.indices.length - 1) {
        this.bubbleSortBookmark = 0;
    }
    for (var i = this.bubbleSortBookmark; i < this.indices.length - 1; i++) {
        if (i == 0) {
            this.changed = 0;
        }
        if (this.indices[i] > this.indices[i + 1]) {
            this.changed = 1;
            // Swap indices
            var tempIndex = this.indices[i];
            this.indices[i] = this.indices[i + 1];
            this.indices[i + 1] = tempIndex;
            // Swap characters in the string
            var tempArrange = this.string.substring(0, i) +
                this.string.substring(i + 1, i + 2) + 
                this.string.substring(i, i + 1) +
                this.string.substring(i + 2);
            this.string = tempArrange;
            // Update the display without the unscramble link during animation
            this.tag.innerHTML = this.string;
            this.bubbleSortBookmark = i;
            break;
        }
    }
    this.bubbleSortBookmark = i;
    if (!this.changed) {
        clearInterval(this.interval);
        // Unscrambling is complete, update the email display with mailto link
        this.tag.innerHTML = '<a href="mailto:' + this.string + '">' + this.string + '</a>';
    }
}
