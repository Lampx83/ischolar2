module.exports = {
    makeId: function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    },
    getMapID: function (e) {
        return e.$route.params.id
        //  return "2M73DO"
    },
    time_ago: function (time) {
        return TimeAgo.inWords(new Date(time).getTime());
    },
    getMainNode: function (node) {
        while (node.data.level > 1) {
            node = node.parent;
        }
        return node;
    },
    getNodeLevel: function (node) {
        let depth = 0;
        while (!node.isroot) {
            depth++;
            node = node.parent;
        }
        return depth;
    }
}

var TimeAgo = (function () {
    var self = {};
    // Public Methods
    self.locales = {
        prefix: '',
        sufix: 'ago',
        seconds: 'less than a min',
        minute: 'about a minute',
        minutes: '%d minutes',
        hour: 'about an hour',
        hours: 'about %d hours',
        day: 'a day',
        days: '%d days',
        month: 'about a month',
        months: '%d months',
        year: 'about a year',
        years: '%d years'
    };

    self.inWords = function (timeAgo) {
        var seconds = Math.floor((new Date() - parseInt(timeAgo)) / 1000),
            separator = this.locales.separator || ' ',
            words = this.locales.prefix + separator,
            interval = 0,
            intervals = {
                year: seconds / 31536000,
                month: seconds / 2592000,
                day: seconds / 86400,
                hour: seconds / 3600,
                minute: seconds / 60
            };

        var distance = this.locales.seconds;

        for (var key in intervals) {
            interval = Math.floor(intervals[key]);

            if (interval > 1) {
                distance = this.locales[key + 's'];
                break;
            } else if (interval === 1) {
                distance = this.locales[key];
                break;
            }
        }

        distance = distance.replace(/%d/i, interval);
        words += distance + separator + this.locales.sufix;

        return words.trim();
    };

    return self;
}());
