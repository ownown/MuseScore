/*
 * SPDX-License-Identifier: GPL-3.0-only
 * MuseScore-Studio-CLA-applies
 *
 * MuseScore Studio
 * Music Composition & Notation
 *
 * Copyright (C) 2021 MuseScore Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

var Navigation = require("Navigation.js")

function selectTab(tab)
{
    switch (tab) {
    case "instruments":
        Navigation.triggerControl("NewScoreDialog", "ChooseTabPanel", "Choose instruments")
        break;
    case "templates":
        Navigation.triggerControl("NewScoreDialog", "ChooseTabPanel", "Create from template")
        break;
    default:
        api.autobot.error("instruments: unknown tab: " + tab)
    }
}

function selectFamily(family)
{
    // Navigation.goToControl("NewScoreDialog", "FamilyView", family)
    Navigation.triggerControl("NewScoreDialog", "FamilyView", family)
}

function selectInstrument(instrument)
{
    // Navigation.goToControl("NewScoreDialog", "InstrumentsView", instrument)
    Navigation.triggerControl("NewScoreDialog", "InstrumentsView", instrument)
}

module.exports = {
    openNewScoreDialog: function()
    {
        api.autobot.async(function() {
            Navigation.triggerControl("RecentScores", "RecentScoresGrid", "New score")
        })
    },

    selectTab: selectTab,

    chooseTemplate: function(category, template)
    {
        Navigation.goToControl("NewScoreDialog", "Category", category)
        Navigation.goToControl("NewScoreDialog", "Template", template)
    },

    done: function()
    {
        Navigation.triggerControl("NewScoreDialog", "BottomPanel", "Done")
    },

    selectFamily: selectFamily,
    selectInstrument: selectInstrument,

    chooseInstrument: function(family, instrument)
    {
        selectTab("instruments")
        selectFamily(family)
        selectInstrument(instrument)
        //Navigation.triggerControl("NewScoreDialog", "SelectPanel", "Select")
    },

    chooseRandomInstruments: function(count, see_msec)
    {
        see_msec = see_msec || 50

        selectTab("instruments")

        api.log.debug("chooseRandomInstruments count: " + count)
        for (var i = 0; i < count; i++) {

            api.log.debug("chooseRandomInstruments i: " + i)
            // Go to first family
            selectFamily("Woodwinds")

            // Choose family
            var familyCount = api.autobot.randomInt(0, 20);
            api.log.debug("chooseRandomInstruments familyCount: " + familyCount)
            for (var f = 0; f < familyCount; f++) {
                api.navigation.down()
                api.autobot.seeChanges(see_msec)
            }

            if (api.navigation.activeControl() === "genreBox") {
                api.navigation.down()
            }

            api.navigation.trigger()

            api.context.setStepVal("family_" + i, api.navigation.activeControl())

            // Got to Instruments
            api.navigation.nextPanel()
            api.autobot.seeChanges(see_msec)

            // Choose instrument
            var instrCount = api.autobot.randomInt(0, 20);
            api.log.debug("chooseRandomInstruments instrCount: " + instrCount)
            for (var j = 0; j < instrCount; j++) {
                api.navigation.down()
                api.autobot.seeChanges(see_msec)
            }

            if (api.navigation.activeControl() === "SearchInstruments") {
                api.navigation.down()
            }

            api.navigation.trigger()

            api.context.setStepVal("instrument_" + i, api.navigation.activeControl())

            // Select
            // api.navigation.triggerControl("NewScoreDialog", "SelectPanel", "Select")
        }
    }
}


