/**
 * Highstock plugin for moving the chart using righ mouse button.
 *
 * Author: Roland Banguiran
 * Email: banguiran@gmail.com
 *
 */

// JSLint options:
/*global Highcharts, document */

(function (H) {
    'use strict';
    var addEvent = H.addEvent,
        doc = document,
        body = doc.body;

    H.wrap(H.Chart.prototype, 'init', function (proceed) {

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var chart = this,
            container = chart.container,
            yAxis = chart.yAxis[0],
            downYPixels,
            downYValue,
            isDragging = false,
            hasDragged = 0;

        addEvent(container, 'mousedown', function (e) {
            body.style.cursor = 'move';

            downYPixels = chart.pointer.normalize(e).chartY;
            downYValue = yAxis.toValue(downYPixels);

            isDragging = true;
        });

        addEvent(doc, 'mousemove', function (e) {
            if (isDragging) {
                var dragYPixels = chart.pointer.normalize(e).chartY,
                    dragYValue = yAxis.toValue(dragYPixels),

                    yExtremes = yAxis.getExtremes(),

                    yUserMin = yExtremes.userMin,
                    yUserMax = yExtremes.userMax,
                    yDataMin = yExtremes.dataMin,
                    yDataMax = yExtremes.dataMax,

                    yMin = yUserMin !== undefined ? yUserMin : yDataMin,
                    yMax = yUserMax !== undefined ? yUserMax : yDataMax,

                    newMinY,
                    newMaxY;

                // determine if the mouse has moved more than 10px
                hasDragged = Math.abs(downYPixels - dragYPixels);

                if (hasDragged > 10) {

                    newMinY = yMin - (dragYValue - downYValue);
                    newMaxY = yMax - (dragYValue - downYValue);

                    yAxis.setExtremes(newMinY, newMaxY, true, false);
                }
            }
        });

        addEvent(doc, 'mouseup', function () {
            if (isDragging) {
                isDragging = false;
            }
        });
    });
}(Highcharts));
