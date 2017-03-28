(function () {
    angular
            .module('meetings')
            .factory('MeetingsService', MeetingsService);

    function MeetingsService(Restangular, FileSaver, Blob) {
        var service = Restangular.service("meetings");

        service.export = function (meetings) {
            var XLSX = window.XLSX;

            function createWorkbook(data, sheetBy) {
                function datenum(v, date1904) {
                    if (date1904)
                        v += 1462;
                    var epoch = Date.parse(v);
                    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
                }

                function meetings2sheet(meetings) {
                    function WorksheetBuilder() {
                        this.ws = {};
                        this.range = {s: {c: 0, r: 0}, e: {c: 0, r: 0}};
                        this.addCell = function (r, c, value) {
                            if (_.isNull(value))
                                value = '';
                            var cell = {v: value};
                            var cell_ref = XLSX.utils.encode_cell({c: c, r: r});
                            if (typeof cell.v === 'number')
                                cell.t = 'n';
                            else if (typeof cell.v === 'boolean')
                                cell.t = 'b';
                            else if (cell.v instanceof Date) {
                                cell.t = 'n';
                                cell.z = XLSX.SSF._table[14];
                                cell.v = datenum(cell.v);
                            } else
                                cell.t = 's';

                            if (c > this.range.e.c)
                                this.range.e.c = c;
                            if (r > this.range.e.r)
                                this.range.e.r = r;
                            this.ws[cell_ref] = cell;
                            this.ws['!ref'] = XLSX.utils.encode_range(this.range);
                        };
                        this.getWorksheet = function () {
                            return this.ws;
                        };
                    }

                    var ws = new WorksheetBuilder();
                    _.each(meetings, function (meeting, i) {
                        var r = i;
                        ws.addCell(r, 0, meeting.location);
                        ws.addCell(r, 1, meeting.date);
                        ws.addCell(r, 2, meeting.topics);
                        var participantsStr = _.map(meeting.participants, function (p) {
                            return p.surname + ' (' + p.institute + ')';
                        }).join(', ');
                        ws.addCell(r, 3, participantsStr);
                    });
                    return ws.getWorksheet();
                }

                var workbook = {
                    Sheets: {},
                    SheetNames: []
                };
                var meetingsGroups = _.groupBy(data, sheetBy);
                _.forEach(meetingsGroups, function (meetingsGroup, key) {
                    workbook.SheetNames.push(key);
                    workbook.Sheets[key] = meetings2sheet(meetingsGroup);
                });
                return workbook;
            }

            var wb = createWorkbook(meetings.plain(), 'platform');
            var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'binary'});

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i !== s.length; ++i)
                    view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            FileSaver.saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), "test.xlsx");
        };

        service.getNewMeeting = function () {
            return {
                date: null,
                location: null,
                topics: null,
                platform: null,
                participants: []
            };
        };

        return service;
    }
})();