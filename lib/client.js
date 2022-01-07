"use strict";
var re =
    /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  parts = [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor",
  ],
  parseuri = function (t) {
    var e = t,
      s = t.indexOf("["),
      r = t.indexOf("]");
    -1 != s &&
      -1 != r &&
      (t =
        t.substring(0, s) +
        t.substring(s, r).replace(/:/g, ";") +
        t.substring(r, t.length));
    for (var i = re.exec(t || ""), o = {}, n = 14; n--; )
      o[parts[n]] = i[n] || "";
    return (
      -1 != s &&
        -1 != r &&
        ((o.source = e),
        (o.host = o.host.substring(1, o.host.length - 1).replace(/;/g, ":")),
        (o.authority = o.authority
          .replace("[", "")
          .replace("]", "")
          .replace(/;/g, ":")),
        (o.ipv6uri = !0)),
      (o.pathNames = pathNames(o, o.path)),
      (o.queryKey = queryKey(o, o.query)),
      o
    );
  };
function pathNames(t, e) {
  var s = e.replace(/\/{2,9}/g, "/").split("/");
  return (
    ("/" != e.substr(0, 1) && 0 !== e.length) || s.splice(0, 1),
    "/" == e.substr(e.length - 1, 1) && s.splice(s.length - 1, 1),
    s
  );
}
function queryKey(t, e) {
  var r = {};
  return (
    e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (t, e, s) {
      e && (r[e] = s);
    }),
    r
  );
}
function url(t, e = "", s) {
  let r = t;
  (s = s || ("undefined" != typeof location && location)),
    "string" == typeof (t = null == t ? s.protocol + "//" + s.host : t) &&
      ("/" === t.charAt(0) &&
        (t = "/" === t.charAt(1) ? s.protocol + t : s.host + t),
      /^(https?|wss?):\/\//.test(t) ||
        (t = void 0 !== s ? s.protocol + "//" + t : "https://" + t),
      (r = parseuri(t))),
    r.port ||
      (/^(http|ws)$/.test(r.protocol)
        ? (r.port = "80")
        : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
    (r.path = r.path || "/");
  t = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
  return (
    (r.id = r.protocol + "://" + t + ":" + r.port + e),
    (r.href =
      r.protocol + "://" + t + (s && s.port === r.port ? "" : ":" + r.port)),
    r
  );
}
function createCommonjsModule(t, e) {
  return t((e = { exports: {} }), e.exports), e.exports;
}
var hasCors = createCommonjsModule(function (e) {
    try {
      e.exports =
        "undefined" != typeof XMLHttpRequest &&
        "withCredentials" in new XMLHttpRequest();
    } catch (t) {
      e.exports = !1;
    }
  }),
  globalThis =
    "undefined" != typeof self
      ? self
      : "undefined" != typeof window
      ? window
      : Function("return this")();
function XMLHttpRequest$1(t) {
  t = t.xdomain;
  try {
    if ("undefined" != typeof XMLHttpRequest && (!t || hasCors))
      return new XMLHttpRequest();
  } catch (t) {}
  if (!t)
    try {
      return new globalThis[["Active"].concat("Object").join("X")](
        "Microsoft.XMLHTTP"
      );
    } catch (t) {}
}
function pick(s, ...t) {
  return t.reduce((t, e) => (s.hasOwnProperty(e) && (t[e] = s[e]), t), {});
}
const NATIVE_SET_TIMEOUT = setTimeout,
  NATIVE_CLEAR_TIMEOUT = clearTimeout;
function installTimerFunctions(t, e) {
  e.useNativeTimers
    ? ((t.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThis)),
      (t.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThis)))
    : ((t.setTimeoutFn = setTimeout.bind(globalThis)),
      (t.clearTimeoutFn = clearTimeout.bind(globalThis)));
}
var Emitter_1 = Emitter;
function Emitter(t) {
  if (t) return mixin(t);
}
function mixin(t) {
  for (var e in Emitter.prototype) t[e] = Emitter.prototype[e];
  return t;
}
(Emitter.prototype.on = Emitter.prototype.addEventListener =
  function (t, e) {
    return (
      (this._callbacks = this._callbacks || {}),
      (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
      this
    );
  }),
  (Emitter.prototype.once = function (t, e) {
    function s() {
      this.off(t, s), e.apply(this, arguments);
    }
    return (s.fn = e), this.on(t, s), this;
  }),
  (Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener =
      function (t, e) {
        if (((this._callbacks = this._callbacks || {}), 0 == arguments.length))
          return (this._callbacks = {}), this;
        var s,
          r = this._callbacks["$" + t];
        if (!r) return this;
        if (1 == arguments.length) return delete this._callbacks["$" + t], this;
        for (var i = 0; i < r.length; i++)
          if ((s = r[i]) === e || s.fn === e) {
            r.splice(i, 1);
            break;
          }
        return 0 === r.length && delete this._callbacks["$" + t], this;
      }),
  (Emitter.prototype.emit = function (t) {
    this._callbacks = this._callbacks || {};
    for (
      var e = new Array(arguments.length - 1),
        s = this._callbacks["$" + t],
        r = 1;
      r < arguments.length;
      r++
    )
      e[r - 1] = arguments[r];
    if (s)
      for (var r = 0, i = (s = s.slice(0)).length; r < i; ++r)
        s[r].apply(this, e);
    return this;
  }),
  (Emitter.prototype.emitReserved = Emitter.prototype.emit),
  (Emitter.prototype.listeners = function (t) {
    return (
      (this._callbacks = this._callbacks || {}), this._callbacks["$" + t] || []
    );
  }),
  (Emitter.prototype.hasListeners = function (t) {
    return !!this.listeners(t).length;
  });
const PACKET_TYPES = Object.create(null);
(PACKET_TYPES.open = "0"),
  (PACKET_TYPES.close = "1"),
  (PACKET_TYPES.ping = "2"),
  (PACKET_TYPES.pong = "3"),
  (PACKET_TYPES.message = "4"),
  (PACKET_TYPES.upgrade = "5"),
  (PACKET_TYPES.noop = "6");
const PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach((t) => {
  PACKET_TYPES_REVERSE[PACKET_TYPES[t]] = t;
});
const ERROR_PACKET = { type: "error", data: "parser error" },
  withNativeBlob$1 =
    "function" == typeof Blob ||
    ("undefined" != typeof Blob &&
      "[object BlobConstructor]" === Object.prototype.toString.call(Blob)),
  withNativeArrayBuffer$2 = "function" == typeof ArrayBuffer,
  isView$1 = (t) =>
    "function" == typeof ArrayBuffer.isView
      ? ArrayBuffer.isView(t)
      : t && t.buffer instanceof ArrayBuffer,
  encodePacket = ({ type: t, data: e }, s, r) =>
    withNativeBlob$1 && e instanceof Blob
      ? s
        ? r(e)
        : encodeBlobAsBase64(e, r)
      : withNativeArrayBuffer$2 && (e instanceof ArrayBuffer || isView$1(e))
      ? s
        ? r(e)
        : encodeBlobAsBase64(new Blob([e]), r)
      : r(PACKET_TYPES[t] + (e || "")),
  encodeBlobAsBase64 = (t, e) => {
    const s = new FileReader();
    return (
      (s.onload = function () {
        var t = s.result.split(",")[1];
        e("b" + t);
      }),
      s.readAsDataURL(t)
    );
  };
for (
  var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    lookup$1 = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256),
    i$1 = 0;
  i$1 < chars.length;
  i$1++
)
  lookup$1[chars.charCodeAt(i$1)] = i$1;
var decode$2 = function (t) {
  var e,
    s,
    r,
    i,
    o = 0.75 * t.length,
    n = t.length,
    a = 0;
  "=" === t[t.length - 1] && (o--, "=" === t[t.length - 2] && o--);
  for (var o = new ArrayBuffer(o), c = new Uint8Array(o), h = 0; h < n; h += 4)
    (e = lookup$1[t.charCodeAt(h)]),
      (s = lookup$1[t.charCodeAt(h + 1)]),
      (r = lookup$1[t.charCodeAt(h + 2)]),
      (i = lookup$1[t.charCodeAt(h + 3)]),
      (c[a++] = (e << 2) | (s >> 4)),
      (c[a++] = ((15 & s) << 4) | (r >> 2)),
      (c[a++] = ((3 & r) << 6) | (63 & i));
  return o;
};
const withNativeArrayBuffer$1 = "function" == typeof ArrayBuffer,
  decodePacket = (t, e) => {
    if ("string" != typeof t) return { type: "message", data: mapBinary(t, e) };
    var s = t.charAt(0);
    return "b" === s
      ? { type: "message", data: decodeBase64Packet(t.substring(1), e) }
      : PACKET_TYPES_REVERSE[s]
      ? 1 < t.length
        ? { type: PACKET_TYPES_REVERSE[s], data: t.substring(1) }
        : { type: PACKET_TYPES_REVERSE[s] }
      : ERROR_PACKET;
  },
  decodeBase64Packet = (t, e) => {
    if (withNativeArrayBuffer$1) {
      var s = decode$2(t);
      return mapBinary(s, e);
    }
    return { base64: !0, data: t };
  },
  mapBinary = (t, e) =>
    "blob" === e && t instanceof ArrayBuffer ? new Blob([t]) : t,
  SEPARATOR = String.fromCharCode(30),
  encodePayload = (t, s) => {
    const r = t.length,
      i = new Array(r);
    let o = 0;
    t.forEach((t, e) => {
      encodePacket(t, !1, (t) => {
        (i[e] = t), ++o === r && s(i.join(SEPARATOR));
      });
    });
  },
  decodePayload = (t, e) => {
    var s = t.split(SEPARATOR);
    const r = [];
    for (let t = 0; t < s.length; t++) {
      var i = decodePacket(s[t], e);
      if ((r.push(i), "error" === i.type)) break;
    }
    return r;
  },
  protocol$1 = 4;
class Transport extends Emitter_1 {
  constructor(t) {
    super(),
      (this.writable = !1),
      installTimerFunctions(this, t),
      (this.opts = t),
      (this.query = t.query),
      (this.readyState = ""),
      (this.socket = t.socket);
  }
  onError(t, e) {
    const s = new Error(t);
    return (
      (s.type = "TransportError"),
      (s.description = e),
      super.emit("error", s),
      this
    );
  }
  open() {
    return (
      ("closed" !== this.readyState && "" !== this.readyState) ||
        ((this.readyState = "opening"), this.doOpen()),
      this
    );
  }
  close() {
    return (
      ("opening" !== this.readyState && "open" !== this.readyState) ||
        (this.doClose(), this.onClose()),
      this
    );
  }
  send(t) {
    "open" === this.readyState && this.write(t);
  }
  onOpen() {
    (this.readyState = "open"), (this.writable = !0), super.emit("open");
  }
  onData(t) {
    t = decodePacket(t, this.socket.binaryType);
    this.onPacket(t);
  }
  onPacket(t) {
    super.emit("packet", t);
  }
  onClose() {
    (this.readyState = "closed"), super.emit("close");
  }
}
var prev,
  alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
      ""
    ),
  length = 64,
  map = {},
  seed = 0,
  i = 0;
function encode$1(t) {
  for (
    var e = "";
    (e = alphabet[t % length] + e), 0 < (t = Math.floor(t / length));

  );
  return e;
}
function decode$1(t) {
  var e = 0;
  for (i = 0; i < t.length; i++) e = e * length + map[t.charAt(i)];
  return e;
}
function yeast() {
  var t = encode$1(+new Date());
  return t !== prev ? ((seed = 0), (prev = t)) : t + "." + encode$1(seed++);
}
for (; i < length; i++) map[alphabet[i]] = i;
(yeast.encode = encode$1), (yeast.decode = decode$1);
var PacketType,
  yeast_1 = yeast,
  encode = function (t) {
    var e,
      s = "";
    for (e in t)
      t.hasOwnProperty(e) &&
        (s.length && (s += "&"),
        (s += encodeURIComponent(e) + "=" + encodeURIComponent(t[e])));
    return s;
  },
  decode = function (t) {
    for (var e = {}, s = t.split("&"), r = 0, i = s.length; r < i; r++) {
      var o = s[r].split("=");
      e[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
    }
    return e;
  },
  parseqs = { encode: encode, decode: decode };
class Polling extends Transport {
  constructor() {
    super(...arguments), (this.polling = !1);
  }
  get name() {
    return "polling";
  }
  doOpen() {
    this.poll();
  }
  pause(t) {
    this.readyState = "pausing";
    const e = () => {
      (this.readyState = "paused"), t();
    };
    if (this.polling || !this.writable) {
      let t = 0;
      this.polling &&
        (t++,
        this.once("pollComplete", function () {
          --t || e();
        })),
        this.writable ||
          (t++,
          this.once("drain", function () {
            --t || e();
          }));
    } else e();
  }
  poll() {
    (this.polling = !0), this.doPoll(), this.emit("poll");
  }
  onData(t) {
    decodePayload(t, this.socket.binaryType).forEach((t) => {
      if (
        ("opening" === this.readyState && "open" === t.type && this.onOpen(),
        "close" === t.type)
      )
        return this.onClose(), !1;
      this.onPacket(t);
    }),
      "closed" !== this.readyState &&
        ((this.polling = !1),
        this.emit("pollComplete"),
        "open" === this.readyState && this.poll());
  }
  doClose() {
    var t = () => {
      this.write([{ type: "close" }]);
    };
    "open" === this.readyState ? t() : this.once("open", t);
  }
  write(t) {
    (this.writable = !1),
      encodePayload(t, (t) => {
        this.doWrite(t, () => {
          (this.writable = !0), this.emit("drain");
        });
      });
  }
  uri() {
    let t = this.query || {};
    var e = this.opts.secure ? "https" : "http";
    let s = "";
    !1 !== this.opts.timestampRequests &&
      (t[this.opts.timestampParam] = yeast_1()),
      this.supportsBinary || t.sid || (t.b64 = 1),
      this.opts.port &&
        (("https" == e && 443 !== Number(this.opts.port)) ||
          ("http" == e && 80 !== Number(this.opts.port))) &&
        (s = ":" + this.opts.port);
    var r = parseqs.encode(t);
    return (
      e +
      "://" +
      (-1 !== this.opts.hostname.indexOf(":")
        ? "[" + this.opts.hostname + "]"
        : this.opts.hostname) +
      s +
      this.opts.path +
      (r.length ? "?" + r : "")
    );
  }
}
function empty() {}
const hasXHR2 = null != new XMLHttpRequest$1({ xdomain: !1 }).responseType;
class XHR extends Polling {
  constructor(e) {
    if ((super(e), "undefined" != typeof location)) {
      var s = "https:" === location.protocol;
      let t = location.port;
      (t = t || (s ? "443" : "80")),
        (this.xd =
          ("undefined" != typeof location &&
            e.hostname !== location.hostname) ||
          t !== e.port),
        (this.xs = e.secure !== s);
    }
    e = e && e.forceBase64;
    this.supportsBinary = hasXHR2 && !e;
  }
  request(t = {}) {
    return (
      Object.assign(t, { xd: this.xd, xs: this.xs }, this.opts),
      new Request(this.uri(), t)
    );
  }
  doWrite(t, e) {
    const s = this.request({ method: "POST", data: t });
    s.on("success", e),
      s.on("error", (t) => {
        this.onError("xhr post error", t);
      });
  }
  doPoll() {
    const t = this.request();
    t.on("data", this.onData.bind(this)),
      t.on("error", (t) => {
        this.onError("xhr poll error", t);
      }),
      (this.pollXhr = t);
  }
}
class Request extends Emitter_1 {
  constructor(t, e) {
    super(),
      installTimerFunctions(this, e),
      (this.opts = e),
      (this.method = e.method || "GET"),
      (this.uri = t),
      (this.async = !1 !== e.async),
      (this.data = void 0 !== e.data ? e.data : null),
      this.create();
  }
  create() {
    const t = pick(
      this.opts,
      "agent",
      "pfx",
      "key",
      "passphrase",
      "cert",
      "ca",
      "ciphers",
      "rejectUnauthorized",
      "autoUnref"
    );
    (t.xdomain = !!this.opts.xd), (t.xscheme = !!this.opts.xs);
    const e = (this.xhr = new XMLHttpRequest$1(t));
    try {
      e.open(this.method, this.uri, this.async);
      try {
        if (this.opts.extraHeaders)
          for (var s in (e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0),
          this.opts.extraHeaders))
            this.opts.extraHeaders.hasOwnProperty(s) &&
              e.setRequestHeader(s, this.opts.extraHeaders[s]);
      } catch (t) {}
      if ("POST" === this.method)
        try {
          e.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (t) {}
      try {
        e.setRequestHeader("Accept", "*/*");
      } catch (t) {}
      "withCredentials" in e && (e.withCredentials = this.opts.withCredentials),
        this.opts.requestTimeout && (e.timeout = this.opts.requestTimeout),
        (e.onreadystatechange = () => {
          4 === e.readyState &&
            (200 === e.status || 1223 === e.status
              ? this.onLoad()
              : this.setTimeoutFn(() => {
                  this.onError("number" == typeof e.status ? e.status : 0);
                }, 0));
        }),
        e.send(this.data);
    } catch (t) {
      return void this.setTimeoutFn(() => {
        this.onError(t);
      }, 0);
    }
    "undefined" != typeof document &&
      ((this.index = Request.requestsCount++),
      (Request.requests[this.index] = this));
  }
  onSuccess() {
    this.emit("success"), this.cleanup();
  }
  onData(t) {
    this.emit("data", t), this.onSuccess();
  }
  onError(t) {
    this.emit("error", t), this.cleanup(!0);
  }
  cleanup(t) {
    if (void 0 !== this.xhr && null !== this.xhr) {
      if (((this.xhr.onreadystatechange = empty), t))
        try {
          this.xhr.abort();
        } catch (t) {}
      "undefined" != typeof document && delete Request.requests[this.index],
        (this.xhr = null);
    }
  }
  onLoad() {
    var t = this.xhr.responseText;
    null !== t && this.onData(t);
  }
  abort() {
    this.cleanup();
  }
}
if (
  ((Request.requestsCount = 0),
  (Request.requests = {}),
  "undefined" != typeof document)
)
  if ("function" == typeof attachEvent) attachEvent("onunload", unloadHandler);
  else if ("function" == typeof addEventListener) {
    const db = "onpagehide" in globalThis ? "pagehide" : "unload";
    addEventListener(db, unloadHandler, !1);
  }
function unloadHandler() {
  for (var t in Request.requests)
    Request.requests.hasOwnProperty(t) && Request.requests[t].abort();
}
const nextTick =
    "function" == typeof Promise && "function" == typeof Promise.resolve
      ? (t) => Promise.resolve().then(t)
      : (t, e) => e(t, 0),
  WebSocket = globalThis.WebSocket || globalThis.MozWebSocket,
  usingBrowserWebSocket = !0,
  defaultBinaryType = "arraybuffer",
  isReactNative =
    "undefined" != typeof navigator &&
    "string" == typeof navigator.product &&
    "reactnative" === navigator.product.toLowerCase();
class WS extends Transport {
  constructor(t) {
    super(t), (this.supportsBinary = !t.forceBase64);
  }
  get name() {
    return "websocket";
  }
  doOpen() {
    if (this.check()) {
      var t = this.uri(),
        e = this.opts.protocols;
      const s = isReactNative
        ? {}
        : pick(
            this.opts,
            "agent",
            "perMessageDeflate",
            "pfx",
            "key",
            "passphrase",
            "cert",
            "ca",
            "ciphers",
            "rejectUnauthorized",
            "localAddress",
            "protocolVersion",
            "origin",
            "maxPayload",
            "family",
            "checkServerIdentity"
          );
      this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
      try {
        this.ws =
          usingBrowserWebSocket && !isReactNative
            ? e
              ? new WebSocket(t, e)
              : new WebSocket(t)
            : new WebSocket(t, e, s);
      } catch (t) {
        return this.emit("error", t);
      }
      (this.ws.binaryType = this.socket.binaryType || defaultBinaryType),
        this.addEventListeners();
    }
  }
  addEventListeners() {
    (this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }),
      (this.ws.onclose = this.onClose.bind(this)),
      (this.ws.onmessage = (t) => this.onData(t.data)),
      (this.ws.onerror = (t) => this.onError("websocket error", t));
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      var s = e[t];
      const r = t === e.length - 1;
      encodePacket(s, this.supportsBinary, (t) => {
        try {
          usingBrowserWebSocket && this.ws.send(t);
        } catch (t) {}
        r &&
          nextTick(() => {
            (this.writable = !0), this.emit("drain");
          }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    void 0 !== this.ws && (this.ws.close(), (this.ws = null));
  }
  uri() {
    let t = this.query || {};
    var e = this.opts.secure ? "wss" : "ws";
    let s = "";
    this.opts.port &&
      (("wss" == e && 443 !== Number(this.opts.port)) ||
        ("ws" == e && 80 !== Number(this.opts.port))) &&
      (s = ":" + this.opts.port),
      this.opts.timestampRequests && (t[this.opts.timestampParam] = yeast_1()),
      this.supportsBinary || (t.b64 = 1);
    var r = parseqs.encode(t);
    return (
      e +
      "://" +
      (-1 !== this.opts.hostname.indexOf(":")
        ? "[" + this.opts.hostname + "]"
        : this.opts.hostname) +
      s +
      this.opts.path +
      (r.length ? "?" + r : "")
    );
  }
  check() {
    return !(
      !WebSocket ||
      ("__initialize" in WebSocket && this.name === WS.prototype.name)
    );
  }
}
const transports = { websocket: WS, polling: XHR };
class Socket$1 extends Emitter_1 {
  constructor(t, e = {}) {
    super(),
      t && "object" == typeof t && ((e = t), (t = null)),
      t
        ? ((t = parseuri(t)),
          (e.hostname = t.host),
          (e.secure = "https" === t.protocol || "wss" === t.protocol),
          (e.port = t.port),
          t.query && (e.query = t.query))
        : e.host && (e.hostname = parseuri(e.host).host),
      installTimerFunctions(this, e),
      (this.secure =
        null != e.secure
          ? e.secure
          : "undefined" != typeof location && "https:" === location.protocol),
      e.hostname && !e.port && (e.port = this.secure ? "443" : "80"),
      (this.hostname =
        e.hostname ||
        ("undefined" != typeof location ? location.hostname : "localhost")),
      (this.port =
        e.port ||
        ("undefined" != typeof location && location.port
          ? location.port
          : this.secure
          ? "443"
          : "80")),
      (this.transports = e.transports || ["polling", "websocket"]),
      (this.readyState = ""),
      (this.writeBuffer = []),
      (this.prevBufferLen = 0),
      (this.opts = Object.assign(
        {
          path: "/engine.io",
          agent: !1,
          withCredentials: !1,
          upgrade: !0,
          timestampParam: "t",
          rememberUpgrade: !1,
          rejectUnauthorized: !0,
          perMessageDeflate: { threshold: 1024 },
          transportOptions: {},
          closeOnBeforeunload: !0,
        },
        e
      )),
      (this.opts.path = this.opts.path.replace(/\/$/, "") + "/"),
      "string" == typeof this.opts.query &&
        (this.opts.query = parseqs.decode(this.opts.query)),
      (this.id = null),
      (this.upgrades = null),
      (this.pingInterval = null),
      (this.pingTimeout = null),
      (this.pingTimeoutTimer = null),
      "function" == typeof addEventListener &&
        (this.opts.closeOnBeforeunload &&
          addEventListener(
            "beforeunload",
            () => {
              this.transport &&
                (this.transport.removeAllListeners(), this.transport.close());
            },
            !1
          ),
        "localhost" !== this.hostname &&
          ((this.offlineEventListener = () => {
            this.onClose("transport close");
          }),
          addEventListener("offline", this.offlineEventListener, !1))),
      this.open();
  }
  createTransport(t) {
    const e = clone(this.opts.query);
    (e.EIO = protocol$1), (e.transport = t), this.id && (e.sid = this.id);
    var s = Object.assign({}, this.opts.transportOptions[t], this.opts, {
      query: e,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port,
    });
    return new transports[t](s);
  }
  open() {
    let t;
    if (
      this.opts.rememberUpgrade &&
      Socket$1.priorWebsocketSuccess &&
      -1 !== this.transports.indexOf("websocket")
    )
      t = "websocket";
    else {
      if (0 === this.transports.length)
        return void this.setTimeoutFn(() => {
          this.emitReserved("error", "No transports available");
        }, 0);
      t = this.transports[0];
    }
    this.readyState = "opening";
    try {
      t = this.createTransport(t);
    } catch (t) {
      return this.transports.shift(), void this.open();
    }
    t.open(), this.setTransport(t);
  }
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(),
      (this.transport = t)
        .on("drain", this.onDrain.bind(this))
        .on("packet", this.onPacket.bind(this))
        .on("error", this.onError.bind(this))
        .on("close", () => {
          this.onClose("transport close");
        });
  }
  probe(t) {
    let s = this.createTransport(t),
      r = !1;
    Socket$1.priorWebsocketSuccess = !1;
    const e = () => {
      r ||
        (s.send([{ type: "ping", data: "probe" }]),
        s.once("packet", (t) => {
          if (!r)
            if ("pong" === t.type && "probe" === t.data)
              (this.upgrading = !0),
                this.emitReserved("upgrading", s),
                s &&
                  ((Socket$1.priorWebsocketSuccess = "websocket" === s.name),
                  this.transport.pause(() => {
                    r ||
                      ("closed" !== this.readyState &&
                        (h(),
                        this.setTransport(s),
                        s.send([{ type: "upgrade" }]),
                        this.emitReserved("upgrade", s),
                        (s = null),
                        (this.upgrading = !1),
                        this.flush()));
                  }));
            else {
              const e = new Error("probe error");
              (e.transport = s.name), this.emitReserved("upgradeError", e);
            }
        }));
    };
    function i() {
      r || ((r = !0), h(), s.close(), (s = null));
    }
    const o = (t) => {
      const e = new Error("probe error: " + t);
      (e.transport = s.name), i(), this.emitReserved("upgradeError", e);
    };
    function n() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function c(t) {
      s && t.name !== s.name && i();
    }
    const h = () => {
      s.removeListener("open", e),
        s.removeListener("error", o),
        s.removeListener("close", n),
        this.off("close", a),
        this.off("upgrading", c);
    };
    s.once("open", e),
      s.once("error", o),
      s.once("close", n),
      this.once("close", a),
      this.once("upgrading", c),
      s.open();
  }
  onOpen() {
    if (
      ((this.readyState = "open"),
      (Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name),
      this.emitReserved("open"),
      this.flush(),
      "open" === this.readyState && this.opts.upgrade && this.transport.pause)
    ) {
      let t = 0;
      for (var e = this.upgrades.length; t < e; t++)
        this.probe(this.upgrades[t]);
    }
  }
  onPacket(t) {
    if (
      "opening" === this.readyState ||
      "open" === this.readyState ||
      "closing" === this.readyState
    )
      switch (
        (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type)
      ) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this.resetPingTimeout(),
            this.sendPacket("pong"),
            this.emitReserved("ping"),
            this.emitReserved("pong");
          break;
        case "error":
          const e = new Error("server error");
          (e.code = t.data), this.onError(e);
          break;
        case "message":
          this.emitReserved("data", t.data),
            this.emitReserved("message", t.data);
      }
  }
  onHandshake(t) {
    this.emitReserved("handshake", t),
      (this.id = t.sid),
      (this.transport.query.sid = t.sid),
      (this.upgrades = this.filterUpgrades(t.upgrades)),
      (this.pingInterval = t.pingInterval),
      (this.pingTimeout = t.pingTimeout),
      this.onOpen(),
      "closed" !== this.readyState && this.resetPingTimeout();
  }
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer),
      (this.pingTimeoutTimer = this.setTimeoutFn(() => {
        this.onClose("ping timeout");
      }, this.pingInterval + this.pingTimeout)),
      this.opts.autoUnref && this.pingTimeoutTimer.unref();
  }
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen),
      (this.prevBufferLen = 0) === this.writeBuffer.length
        ? this.emitReserved("drain")
        : this.flush();
  }
  flush() {
    "closed" !== this.readyState &&
      this.transport.writable &&
      !this.upgrading &&
      this.writeBuffer.length &&
      (this.transport.send(this.writeBuffer),
      (this.prevBufferLen = this.writeBuffer.length),
      this.emitReserved("flush"));
  }
  write(t, e, s) {
    return this.sendPacket("message", t, e, s), this;
  }
  send(t, e, s) {
    return this.sendPacket("message", t, e, s), this;
  }
  sendPacket(t, e, s, r) {
    "function" == typeof e && ((r = e), (e = void 0)),
      "function" == typeof s && ((r = s), (s = null)),
      "closing" !== this.readyState &&
        "closed" !== this.readyState &&
        (((s = s || {}).compress = !1 !== s.compress),
        this.emitReserved(
          "packetCreate",
          (s = { type: t, data: e, options: s })
        ),
        this.writeBuffer.push(s),
        r && this.once("flush", r),
        this.flush());
  }
  close() {
    const t = () => {
        this.onClose("forced close"), this.transport.close();
      },
      e = () => {
        this.off("upgrade", e), this.off("upgradeError", e), t();
      },
      s = () => {
        this.once("upgrade", e), this.once("upgradeError", e);
      };
    return (
      ("opening" !== this.readyState && "open" !== this.readyState) ||
        ((this.readyState = "closing"),
        this.writeBuffer.length
          ? this.once("drain", () => {
              (this.upgrading ? s : t)();
            })
          : (this.upgrading ? s : t)()),
      this
    );
  }
  onError(t) {
    (Socket$1.priorWebsocketSuccess = !1),
      this.emitReserved("error", t),
      this.onClose("transport error", t);
  }
  onClose(t, e) {
    ("opening" !== this.readyState &&
      "open" !== this.readyState &&
      "closing" !== this.readyState) ||
      (this.clearTimeoutFn(this.pingTimeoutTimer),
      this.transport.removeAllListeners("close"),
      this.transport.close(),
      this.transport.removeAllListeners(),
      "function" == typeof removeEventListener &&
        removeEventListener("offline", this.offlineEventListener, !1),
      (this.readyState = "closed"),
      (this.id = null),
      this.emitReserved("close", t, e),
      (this.writeBuffer = []),
      (this.prevBufferLen = 0));
  }
  filterUpgrades(t) {
    const e = [];
    let s = 0;
    for (var r = t.length; s < r; s++)
      ~this.transports.indexOf(t[s]) && e.push(t[s]);
    return e;
  }
}
function clone(t) {
  const e = {};
  for (var s in t) t.hasOwnProperty(s) && (e[s] = t[s]);
  return e;
}
Socket$1.protocol = protocol$1;
const withNativeArrayBuffer = "function" == typeof ArrayBuffer,
  isView = (t) =>
    "function" == typeof ArrayBuffer.isView
      ? ArrayBuffer.isView(t)
      : t.buffer instanceof ArrayBuffer,
  toString = Object.prototype.toString,
  withNativeBlob =
    "function" == typeof Blob ||
    ("undefined" != typeof Blob &&
      "[object BlobConstructor]" === toString.call(Blob)),
  withNativeFile =
    "function" == typeof File ||
    ("undefined" != typeof File &&
      "[object FileConstructor]" === toString.call(File));
function isBinary(t) {
  return (
    (withNativeArrayBuffer && (t instanceof ArrayBuffer || isView(t))) ||
    (withNativeBlob && t instanceof Blob) ||
    (withNativeFile && t instanceof File)
  );
}
function hasBinary(s, t) {
  if (!s || "object" != typeof s) return !1;
  if (Array.isArray(s)) {
    for (let t = 0, e = s.length; t < e; t++) if (hasBinary(s[t])) return !0;
    return !1;
  }
  if (isBinary(s)) return !0;
  if (s.toJSON && "function" == typeof s.toJSON && 1 === arguments.length)
    return hasBinary(s.toJSON(), !0);
  for (const e in s)
    if (Object.prototype.hasOwnProperty.call(s, e) && hasBinary(s[e]))
      return !0;
  return !1;
}
function deconstructPacket(t) {
  var e = [],
    s = t.data;
  const r = t;
  return (
    (r.data = _deconstructPacket(s, e)),
    (r.attachments = e.length),
    { packet: r, buffers: e }
  );
}
function _deconstructPacket(e, s) {
  if (!e) return e;
  if (isBinary(e)) {
    var t = { _placeholder: !0, num: s.length };
    return s.push(e), t;
  }
  if (Array.isArray(e)) {
    const r = new Array(e.length);
    for (let t = 0; t < e.length; t++) r[t] = _deconstructPacket(e[t], s);
    return r;
  }
  if ("object" != typeof e || e instanceof Date) return e;
  {
    const i = {};
    for (const o in e)
      e.hasOwnProperty(o) && (i[o] = _deconstructPacket(e[o], s));
    return i;
  }
}
function reconstructPacket(t, e) {
  return (t.data = _reconstructPacket(t.data, e)), (t.attachments = void 0), t;
}
function _reconstructPacket(e, s) {
  if (!e) return e;
  if (e && e._placeholder) return s[e.num];
  if (Array.isArray(e))
    for (let t = 0; t < e.length; t++) e[t] = _reconstructPacket(e[t], s);
  else if ("object" == typeof e)
    for (const t in e)
      e.hasOwnProperty(t) && (e[t] = _reconstructPacket(e[t], s));
  return e;
}
const protocol = 5;
!(function (t) {
  (t[(t.CONNECT = 0)] = "CONNECT"),
    (t[(t.DISCONNECT = 1)] = "DISCONNECT"),
    (t[(t.EVENT = 2)] = "EVENT"),
    (t[(t.ACK = 3)] = "ACK"),
    (t[(t.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
    (t[(t.BINARY_EVENT = 5)] = "BINARY_EVENT"),
    (t[(t.BINARY_ACK = 6)] = "BINARY_ACK");
})((PacketType = PacketType || {}));
class Encoder {
  encode(t) {
    return (t.type !== PacketType.EVENT && t.type !== PacketType.ACK) ||
      !hasBinary(t)
      ? [this.encodeAsString(t)]
      : ((t.type =
          t.type === PacketType.EVENT
            ? PacketType.BINARY_EVENT
            : PacketType.BINARY_ACK),
        this.encodeAsBinary(t));
  }
  encodeAsString(t) {
    let e = "" + t.type;
    return (
      (t.type !== PacketType.BINARY_EVENT &&
        t.type !== PacketType.BINARY_ACK) ||
        (e += t.attachments + "-"),
      t.nsp && "/" !== t.nsp && (e += t.nsp + ","),
      null != t.id && (e += t.id),
      null != t.data && (e += JSON.stringify(t.data)),
      e
    );
  }
  encodeAsBinary(t) {
    var e = deconstructPacket(t),
      t = this.encodeAsString(e.packet);
    const s = e.buffers;
    return s.unshift(t), s;
  }
}
class Decoder extends Emitter_1 {
  constructor() {
    super();
  }
  add(t) {
    let e;
    if ("string" == typeof t)
      (e = this.decodeString(t)),
        e.type === PacketType.BINARY_EVENT || e.type === PacketType.BINARY_ACK
          ? ((this.reconstructor = new BinaryReconstructor(e)),
            0 === e.attachments && super.emitReserved("decoded", e))
          : super.emitReserved("decoded", e);
    else {
      if (!isBinary(t) && !t.base64) throw new Error("Unknown type: " + t);
      if (!this.reconstructor)
        throw new Error("got binary data when not reconstructing a packet");
      (e = this.reconstructor.takeBinaryData(t)),
        e && ((this.reconstructor = null), super.emitReserved("decoded", e));
    }
  }
  decodeString(t) {
    let e = 0;
    const s = { type: Number(t.charAt(0)) };
    if (void 0 === PacketType[s.type])
      throw new Error("unknown packet type " + s.type);
    if (
      s.type === PacketType.BINARY_EVENT ||
      s.type === PacketType.BINARY_ACK
    ) {
      for (var r = e + 1; "-" !== t.charAt(++e) && e != t.length; );
      r = t.substring(r, e);
      if (r != Number(r) || "-" !== t.charAt(e))
        throw new Error("Illegal attachments");
      s.attachments = Number(r);
    }
    if ("/" === t.charAt(e + 1)) {
      for (var i = e + 1; ++e; ) {
        if ("," === t.charAt(e)) break;
        if (e === t.length) break;
      }
      s.nsp = t.substring(i, e);
    } else s.nsp = "/";
    i = t.charAt(e + 1);
    if ("" !== i && Number(i) == i) {
      for (var o = e + 1; ++e; ) {
        var n = t.charAt(e);
        if (null == n || Number(n) != n) {
          --e;
          break;
        }
        if (e === t.length) break;
      }
      s.id = Number(t.substring(o, e + 1));
    }
    if (t.charAt(++e)) {
      o = tryParse(t.substr(e));
      if (!Decoder.isPayloadValid(s.type, o))
        throw new Error("invalid payload");
      s.data = o;
    }
    return s;
  }
  static isPayloadValid(t, e) {
    switch (t) {
      case PacketType.CONNECT:
        return "object" == typeof e;
      case PacketType.DISCONNECT:
        return void 0 === e;
      case PacketType.CONNECT_ERROR:
        return "string" == typeof e || "object" == typeof e;
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        return Array.isArray(e) && 0 < e.length;
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        return Array.isArray(e);
    }
  }
  destroy() {
    this.reconstructor && this.reconstructor.finishedReconstruction();
  }
}
function tryParse(t) {
  try {
    return JSON.parse(t);
  } catch (t) {
    return !1;
  }
}
class BinaryReconstructor {
  constructor(t) {
    (this.packet = t), (this.buffers = []), (this.reconPack = t);
  }
  takeBinaryData(t) {
    if (
      (this.buffers.push(t), this.buffers.length !== this.reconPack.attachments)
    )
      return null;
    t = reconstructPacket(this.reconPack, this.buffers);
    return this.finishedReconstruction(), t;
  }
  finishedReconstruction() {
    (this.reconPack = null), (this.buffers = []);
  }
}
var parser = Object.freeze({
  __proto__: null,
  protocol: protocol,
  get PacketType() {
    return PacketType;
  },
  Encoder: Encoder,
  Decoder: Decoder,
});
function on(t, e, s) {
  return (
    t.on(e, s),
    function () {
      t.off(e, s);
    }
  );
}
const RESERVED_EVENTS = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  newListener: 1,
  removeListener: 1,
});
class Socket extends Emitter_1 {
  constructor(t, e, s) {
    super(),
      (this.connected = !1),
      (this.disconnected = !0),
      (this.receiveBuffer = []),
      (this.sendBuffer = []),
      (this.ids = 0),
      (this.acks = {}),
      (this.flags = {}),
      (this.io = t),
      (this.nsp = e),
      s && s.auth && (this.auth = s.auth),
      this.io._autoConnect && this.open();
  }
  subEvents() {
    var t;
    this.subs ||
      ((t = this.io),
      (this.subs = [
        on(t, "open", this.onopen.bind(this)),
        on(t, "packet", this.onpacket.bind(this)),
        on(t, "error", this.onerror.bind(this)),
        on(t, "close", this.onclose.bind(this)),
      ]));
  }
  get active() {
    return !!this.subs;
  }
  connect() {
    return (
      this.connected ||
        (this.subEvents(),
        this.io._reconnecting || this.io.open(),
        "open" === this.io._readyState && this.onopen()),
      this
    );
  }
  open() {
    return this.connect();
  }
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
  }
  emit(t, ...e) {
    if (RESERVED_EVENTS.hasOwnProperty(t))
      throw new Error('"' + t + '" is a reserved event name');
    e.unshift(t);
    const s = { type: PacketType.EVENT, data: e };
    (s.options = {}),
      (s.options.compress = !1 !== this.flags.compress),
      "function" == typeof e[e.length - 1] &&
        ((r = this.ids++),
        (e = e.pop()),
        this._registerAckCallback(r, e),
        (s.id = r));
    var r =
      this.io.engine &&
      this.io.engine.transport &&
      this.io.engine.transport.writable;
    return (
      (this.flags.volatile && (!r || !this.connected)) ||
        (this.connected ? this.packet(s) : this.sendBuffer.push(s)),
      (this.flags = {}),
      this
    );
  }
  _registerAckCallback(e, s) {
    var t = this.flags.timeout;
    if (void 0 !== t) {
      const r = this.io.setTimeoutFn(() => {
        delete this.acks[e];
        for (let t = 0; t < this.sendBuffer.length; t++)
          this.sendBuffer[t].id === e && this.sendBuffer.splice(t, 1);
        s.call(this, new Error("operation has timed out"));
      }, t);
      this.acks[e] = (...t) => {
        this.io.clearTimeoutFn(r), s.apply(this, [null, ...t]);
      };
    } else this.acks[e] = s;
  }
  packet(t) {
    (t.nsp = this.nsp), this.io._packet(t);
  }
  onopen() {
    "function" == typeof this.auth
      ? this.auth((t) => {
          this.packet({ type: PacketType.CONNECT, data: t });
        })
      : this.packet({ type: PacketType.CONNECT, data: this.auth });
  }
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  onclose(t) {
    (this.connected = !1),
      (this.disconnected = !0),
      delete this.id,
      this.emitReserved("disconnect", t);
  }
  onpacket(t) {
    var e;
    if (t.nsp === this.nsp)
      switch (t.type) {
        case PacketType.CONNECT:
          t.data && t.data.sid
            ? ((e = t.data.sid), this.onconnect(e))
            : this.emitReserved(
                "connect_error",
                new Error(
                  "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                )
              );
          break;
        case PacketType.EVENT:
        case PacketType.BINARY_EVENT:
          this.onevent(t);
          break;
        case PacketType.ACK:
        case PacketType.BINARY_ACK:
          this.onack(t);
          break;
        case PacketType.DISCONNECT:
          this.ondisconnect();
          break;
        case PacketType.CONNECT_ERROR:
          this.destroy();
          const s = new Error(t.data.message);
          (s.data = t.data.data), this.emitReserved("connect_error", s);
      }
  }
  onevent(t) {
    const e = t.data || [];
    null != t.id && e.push(this.ack(t.id)),
      this.connected
        ? this.emitEvent(e)
        : this.receiveBuffer.push(Object.freeze(e));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length)
      for (const e of this._anyListeners.slice()) e.apply(this, t);
    super.emit.apply(this, t);
  }
  ack(e) {
    const s = this;
    let r = !1;
    return function (...t) {
      r || ((r = !0), s.packet({ type: PacketType.ACK, id: e, data: t }));
    };
  }
  onack(t) {
    const e = this.acks[t.id];
    "function" == typeof e && (e.apply(this, t.data), delete this.acks[t.id]);
  }
  onconnect(t) {
    (this.id = t),
      (this.connected = !0),
      (this.disconnected = !1),
      this.emitBuffered(),
      this.emitReserved("connect");
  }
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)),
      (this.receiveBuffer = []),
      this.sendBuffer.forEach((t) => this.packet(t)),
      (this.sendBuffer = []);
  }
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  destroy() {
    this.subs && (this.subs.forEach((t) => t()), (this.subs = void 0)),
      this.io._destroy(this);
  }
  disconnect() {
    return (
      this.connected && this.packet({ type: PacketType.DISCONNECT }),
      this.destroy(),
      this.connected && this.onclose("io client disconnect"),
      this
    );
  }
  close() {
    return this.disconnect();
  }
  compress(t) {
    return (this.flags.compress = t), this;
  }
  get volatile() {
    return (this.flags.volatile = !0), this;
  }
  timeout(t) {
    return (this.flags.timeout = t), this;
  }
  onAny(t) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.push(t),
      this
    );
  }
  prependAny(t) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.unshift(t),
      this
    );
  }
  offAny(e) {
    if (!this._anyListeners) return this;
    if (e) {
      const s = this._anyListeners;
      for (let t = 0; t < s.length; t++)
        if (e === s[t]) return s.splice(t, 1), this;
    } else this._anyListeners = [];
    return this;
  }
  listenersAny() {
    return this._anyListeners || [];
  }
}
var backo2 = Backoff;
function Backoff(t) {
  (this.ms = (t = t || {}).min || 100),
    (this.max = t.max || 1e4),
    (this.factor = t.factor || 2),
    (this.jitter = 0 < t.jitter && t.jitter <= 1 ? t.jitter : 0),
    (this.attempts = 0);
}
(Backoff.prototype.duration = function () {
  var t,
    e,
    s = this.ms * Math.pow(this.factor, this.attempts++);
  return (
    this.jitter &&
      ((t = Math.random()),
      (e = Math.floor(t * this.jitter * s)),
      (s = 0 == (1 & Math.floor(10 * t)) ? s - e : s + e)),
    0 | Math.min(s, this.max)
  );
}),
  (Backoff.prototype.reset = function () {
    this.attempts = 0;
  }),
  (Backoff.prototype.setMin = function (t) {
    this.ms = t;
  }),
  (Backoff.prototype.setMax = function (t) {
    this.max = t;
  }),
  (Backoff.prototype.setJitter = function (t) {
    this.jitter = t;
  });
class Manager extends Emitter_1 {
  constructor(t, e) {
    var s;
    super(),
      (this.nsps = {}),
      (this.subs = []),
      t && "object" == typeof t && ((e = t), (t = void 0)),
      ((e = e || {}).path = e.path || "/socket.io"),
      (this.opts = e),
      installTimerFunctions(this, e),
      this.reconnection(!1 !== e.reconnection),
      this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
      this.reconnectionDelay(e.reconnectionDelay || 1e3),
      this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
      this.randomizationFactor(
        null !== (s = e.randomizationFactor) && void 0 !== s ? s : 0.5
      ),
      (this.backoff = new backo2({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor(),
      })),
      this.timeout(null == e.timeout ? 2e4 : e.timeout),
      (this._readyState = "closed"),
      (this.uri = t);
    const r = e.parser || parser;
    (this.encoder = new r.Encoder()),
      (this.decoder = new r.Decoder()),
      (this._autoConnect = !1 !== e.autoConnect),
      this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length
      ? ((this._reconnection = !!t), this)
      : this._reconnection;
  }
  reconnectionAttempts(t) {
    return void 0 === t
      ? this._reconnectionAttempts
      : ((this._reconnectionAttempts = t), this);
  }
  reconnectionDelay(t) {
    var e;
    return void 0 === t
      ? this._reconnectionDelay
      : ((this._reconnectionDelay = t),
        null !== (e = this.backoff) && void 0 !== e && e.setMin(t),
        this);
  }
  randomizationFactor(t) {
    var e;
    return void 0 === t
      ? this._randomizationFactor
      : ((this._randomizationFactor = t),
        null !== (e = this.backoff) && void 0 !== e && e.setJitter(t),
        this);
  }
  reconnectionDelayMax(t) {
    var e;
    return void 0 === t
      ? this._reconnectionDelayMax
      : ((this._reconnectionDelayMax = t),
        null !== (e = this.backoff) && void 0 !== e && e.setMax(t),
        this);
  }
  timeout(t) {
    return arguments.length ? ((this._timeout = t), this) : this._timeout;
  }
  maybeReconnectOnOpen() {
    !this._reconnecting &&
      this._reconnection &&
      0 === this.backoff.attempts &&
      this.reconnect();
  }
  open(e) {
    if (~this._readyState.indexOf("open")) return this;
    this.engine = new Socket$1(this.uri, this.opts);
    const t = this.engine,
      s = this;
    (this._readyState = "opening"), (this.skipReconnect = !1);
    const r = on(t, "open", function () {
      s.onopen(), e && e();
    });
    var i = on(t, "error", (t) => {
      s.cleanup(),
        (s._readyState = "closed"),
        this.emitReserved("error", t),
        e ? e(t) : s.maybeReconnectOnOpen();
    });
    if (!1 !== this._timeout) {
      var o = this._timeout;
      0 === o && r();
      const n = this.setTimeoutFn(() => {
        r(), t.close(), t.emit("error", new Error("timeout"));
      }, o);
      this.opts.autoUnref && n.unref(),
        this.subs.push(function () {
          clearTimeout(n);
        });
    }
    return this.subs.push(r), this.subs.push(i), this;
  }
  connect(t) {
    return this.open(t);
  }
  onopen() {
    this.cleanup(), (this._readyState = "open"), this.emitReserved("open");
    var t = this.engine;
    this.subs.push(
      on(t, "ping", this.onping.bind(this)),
      on(t, "data", this.ondata.bind(this)),
      on(t, "error", this.onerror.bind(this)),
      on(t, "close", this.onclose.bind(this)),
      on(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  onping() {
    this.emitReserved("ping");
  }
  ondata(t) {
    this.decoder.add(t);
  }
  ondecoded(t) {
    this.emitReserved("packet", t);
  }
  onerror(t) {
    this.emitReserved("error", t);
  }
  socket(t, e) {
    let s = this.nsps[t];
    return s || ((s = new Socket(this, t, e)), (this.nsps[t] = s)), s;
  }
  _destroy(t) {
    for (const e of Object.keys(this.nsps)) {
      const t = this.nsps[e];
      if (t.active) return;
    }
    this._close();
  }
  _packet(e) {
    var s = this.encoder.encode(e);
    for (let t = 0; t < s.length; t++) this.engine.write(s[t], e.options);
  }
  cleanup() {
    this.subs.forEach((t) => t()),
      (this.subs.length = 0),
      this.decoder.destroy();
  }
  _close() {
    (this.skipReconnect = !0),
      (this._reconnecting = !1),
      this.onclose("forced close"),
      this.engine && this.engine.close();
  }
  disconnect() {
    return this._close();
  }
  onclose(t) {
    this.cleanup(),
      this.backoff.reset(),
      (this._readyState = "closed"),
      this.emitReserved("close", t),
      this._reconnection && !this.skipReconnect && this.reconnect();
  }
  reconnect() {
    if (this._reconnecting || this.skipReconnect) return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(),
        this.emitReserved("reconnect_failed"),
        (this._reconnecting = !1);
    else {
      var t = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        e.skipReconnect ||
          (this.emitReserved("reconnect_attempt", e.backoff.attempts),
          e.skipReconnect ||
            e.open((t) => {
              t
                ? ((e._reconnecting = !1),
                  e.reconnect(),
                  this.emitReserved("reconnect_error", t))
                : e.onreconnect();
            }));
      }, t);
      this.opts.autoUnref && s.unref(),
        this.subs.push(function () {
          clearTimeout(s);
        });
    }
  }
  onreconnect() {
    var t = this.backoff.attempts;
    (this._reconnecting = !1),
      this.backoff.reset(),
      this.emitReserved("reconnect", t);
  }
}
const cache = {};
function lookup(t, e) {
  "object" == typeof t && ((e = t), (t = void 0));
  var s = url(t, (e = e || {}).path || "/socket.io"),
    r = s.source,
    i = s.id,
    t = s.path,
    t = cache[i] && t in cache[i].nsps,
    t = e.forceNew || e["force new connection"] || !1 === e.multiplex || t;
  let o;
  return (
    (o = t
      ? new Manager(r, e)
      : (cache[i] || (cache[i] = new Manager(r, e)), cache[i])),
    s.query && !e.query && (e.query = s.queryKey),
    o.socket(s.path, e)
  );
}
Object.assign(lookup, {
  Manager: Manager,
  Socket: Socket,
  io: lookup,
  connect: lookup,
});
var socket = lookup.connect("ws://localhost:8888");
socket.on("connect", function () {
  console.log(socket.id);
}),
  socket.on("broadcast", function () {
    var t;
    (t = console).log.apply(t, arguments);
  }),
  socket.on("expired", function (t) {
    alert(t);
  }),
  (window.onload = function () {
    var t = document.querySelector("#kissdev"),
      e = t.getAttribute("project_id"),
      s = t.getAttribute("hash"),
      t = t.getAttribute("ref");
    socket.emit("update", { project_id: e, hash: s, ref: t });
  });
