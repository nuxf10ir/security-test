$(document).ready(function () {

    var $form = $("#security-test__form"),
        $rows = $(".security-test__row", $form),
        $result = $(".security-test__result", $form),
        testScore = 0,
        crucialScore = 70;


    

    function animateShow(showNote, showQuestion, hideQuestion) {
        var $showNoteDfd = new $.Deferred(),
            $showNotePromise = $showNoteDfd.promise(),
            $hideQuestionDfd = new $.Deferred(),
            $hideQuestionPromise = $hideQuestionDfd.promise();

        if (hideQuestion) {
            hideQuestion
                .animate({
                    opacity: 0,
                    top: -500
                }, {
                    duration: 600,
                    complete: function () {
                        hideQuestion.hide();
                        $hideQuestionDfd.resolve();
                    }
                });
        } else {
            $hideQuestionDfd.resolve();
        }

        $.when($hideQuestionPromise).then(function () {
            if (showNote) {
                showNote.css({
                    opacity: 0,
                    top: 20,
                    display: "block"
                });

                showNote
                    .animate({
                        opacity: 1,
                        top: 0
                    }, {
                        duration: 600,
                        complete: function () {
                            $showNoteDfd.resolve();
                        }
                    });
            } else {
                $showNoteDfd.resolve();
            }
        });

        $.when($showNotePromise).then(function () {
            showQuestion.css({
                opacity: 0,
                top: 20
            });

            showQuestion
                .show()
                .animate({
                    opacity: 1,
                    top: 0
                }, {
                    duration: 600,
                    complete: function () {
                        initBlock(showQuestion);
                    }
                });
        });

    }

    function initBlock($block) {
        $block.delegate("input", "change", function () {
            var $thisInput = $(this),
                $note = $block.find(".security-test__note"),
                $next = $block.next(".security-test__row"),
                $rowInputs = $block.find(".security-test__radio"),
                rowIndex = parseInt($block.data("index")),
                $prev = null;

            $block
                .toggleClass("not-answered", false)
                .toggleClass("answered", true)
                .undelegate("input", "change");

            $rowInputs.prop("disabled", true);

            refreshResult(parseInt($thisInput.val()));

            if (rowIndex > 0) {
                $prev = $rows.eq(--rowIndex);
            }

            if ($next.is(":hidden")) {
                animateShow($note, $next, $prev);
            }
        });
    }

    function refreshResult(value) {
        testScore = testScore + value;

        $result
            .toggleClass("passed", testScore >= crucialScore)
            .toggleClass("failed", testScore < crucialScore)
            .find(".result-value")
            .text(testScore);
    }

    animateShow(null, $(".security-test__row", $form).eq(0));


});