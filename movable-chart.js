/**
 * Highstock plugin for moving the chart using right mouse button.
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
            xAxis = chart.xAxis[0],
            yAxis = chart.yAxis[0],
            downXPixels,
            downYPixels,
            downXValue,
            downYValue,
            isDragging = false,
            hasDragged = 0,
            preventContextMenu;

        addEvent(container, 'mousedown', function (e) {
            if (e.which === 3) {
                body.style.cursor = 'move';

                downXPixels = chart.pointer.normalize(e).chartX;
                downYPixels = chart.pointer.normalize(e).chartY;

                downXValue = xAxis.toValue(downXPixels);
                downYValue = yAxis.toValue(downYPixels);

                isDragging = true;

                doc.removeEventListener('contextmenu', preventContextMenu, false);
            }
        });

        addEvent(doc, 'mousemove', function (e) {
            if (isDragging) {
                var dragXPixels = chart.pointer.normalize(e).chartX,
                    dragYPixels = chart.pointer.normalize(e).chartY,
                    dragXValue = xAxis.toValue(dragXPixels),
                    dragYValue = yAxis.toValue(dragYPixels),

                    xExtremes = xAxis.getExtremes(),
                    yExtremes = yAxis.getExtremes(),

                    xUserMin = xExtremes.userMin,
                    xUserMax = xExtremes.userMax,
                    xDataMin = xExtremes.dataMin,
                    xDataMax = xExtremes.dataMax,

                    yUserMin = yExtremes.userMin,
                    yUserMax = yExtremes.userMax,
                    yDataMin = yExtremes.dataMin,
                    yDataMax = yExtremes.dataMax,

                    xMin = xUserMin !== undefined ? xUserMin : xDataMin,
                    xMax = xUserMax !== undefined ? xUserMax : xDataMax,

                    yMin = yUserMin !== undefined ? yUserMin : yDataMin,
                    yMax = yUserMax !== undefined ? yUserMax : yDataMax,

                    newMinX,
                    newMaxX,
                    newMinY,
                    newMaxY;

                // determine if the mouse has moved more than 10px
                hasDragged = Math.sqrt(Math.pow(downXPixels - dragXPixels, 2) + Math.pow(downYPixels - dragYPixels, 2));

                if (hasDragged > 10) {

                    newMinX = xMin - (dragXValue - downXValue);
                    newMaxX = xMax - (dragXValue - downXValue);

                    newMinY = yMin - (dragYValue - downYValue);
                    newMaxY = yMax - (dragYValue - downYValue);

                    xAxis.setExtremes(newMinX, newMaxX, true, false);
                    yAxis.setExtremes(newMinY, newMaxY, true, false);

                    doc.addEventListener('contextmenu', preventContextMenu, false);
                }
            }
        });

        addEvent(doc, 'mouseup', function () {
            if (isDragging) {
                isDragging = false;
            }
        });

        preventContextMenu = function (e) {
            e.preventDefault();
        };
    });
}(Highcharts));
