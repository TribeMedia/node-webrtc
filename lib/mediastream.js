var RTCMediaStreamTrack = require('./mediastreamtrack');

var EventTarget = require('eventtarget');


//MediaStream.prototype._getMS = function _getMS() {
//  if(!this._ms) {
//    throw new Error('RTCMediaSteam is gone');
//  }
//  return this._ms;
//};

//MediaStream.prototype._executeNext = function _executeNext() {
//  var obj, ms;
//  ms = this._getMS();
//  if(this._queue.length > 0) {
//    obj = this._queue.shift();
//    ms[obj.func].apply(ms, obj.args);
//    if(obj.wait)
//    {
//      this._pending = obj;
//    } else {
//      this._executeNext();
//    }
//  } else {
//    this._pending = null;
//  }
//};


function RTCMediaStream(internalMS) {
  var that = this;

  EventTarget.call(this);

  internalMS.onactive = function onactive() {
    that.dispatchEvent(new Event('active'));
  };

  internalMS.oninactive = function oninactive() {
    that.dispatchEvent(new Event('inactive'));
  };

  internalMS.onaddtrack = function onaddtrack(internalMST) {
    var mst = new RTCMediaStreamTrack(internalMST);
    that.dispatchEvent(mst);
  };

  internalMS.onremovetrack = function onremovetrack(internalMST) {
    var mst = new RTCMediaStreamTrack(internalMST);
    that.dispatchEvent(mst);
  };

  var queue = [];
  var pending = null;


  function queueOrRun(obj) {
    if(null == this._pending) {
      internalMS[obj.func].apply(internalMS, obj.args);

      if(obj.wait) {
        pending = obj;
      }
    } else {
      queue.push(obj);
    }
  };


  Object.defineProperties(this, {
    'id': {
      get: function getId() {
        return runImmediately({
          func: 'getId',
          args: []
        });
      }
    },
    'inactive': {
      get: function isInactive() {
        return runImmediately({
          func: 'isInactive',
          args: []
        });
      }
    }
  });

  this.getaudiotracks = function getaudiotracks() {
    return runImmediately({
      func: 'getAudioTracks',
      args: []
    });
  };

  this.getvideotracks = function getvideotracks() {
    return runImmediately({
      func: 'getVideoTracks',
      args: []
    });
  };

  this.gettrackbyid = function gettrackbyid(id) {
    return runImmediately({
      func: 'getTrackById',
      args: [id]
    });
  };

  this.addtrack = function addtrack(track) {
    queueOrRun({
      func: 'addTrack',
      args: [track._getMST()]
    });
  };

  this.removetrack = function removetrack(track) {
    queueOrRun({
      func: 'removeTrack',
      args: [track._getMST()]
    });
  };
  
  // FIXME: implement clone
  /*this.clone = function clone() {
    return internalMS.clone();
  };*/
}


module.exports = RTCMediaStream;