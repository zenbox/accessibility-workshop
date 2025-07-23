if (
    (!(function (t, e) {
        "object" == typeof module && "object" == typeof module.exports
            ? (module.exports = t.document
                  ? e(t, !0)
                  : function (t) {
                        if (!t.document)
                            throw new Error(
                                "jQuery requires a window with a document"
                            )
                        return e(t)
                    })
            : e(t)
    })("undefined" != typeof window ? window : this, function (f, t) {
        function e(t, e) {
            return e.toUpperCase()
        }
        var n = [],
            u = n.slice,
            g = n.concat,
            a = n.push,
            i = n.indexOf,
            r = {},
            o = r.toString,
            m = r.hasOwnProperty,
            v = {},
            y = f.document,
            s = "2.1.3",
            C = function (t, e) {
                return new C.fn.init(t, e)
            },
            l = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            c = /^-ms-/,
            p = /-([\da-z])/gi
        function h(t) {
            var e = t.length,
                n = C.type(t)
            return (
                "function" !== n &&
                !C.isWindow(t) &&
                (!(1 !== t.nodeType || !e) ||
                    "array" === n ||
                    0 === e ||
                    ("number" == typeof e && 0 < e && e - 1 in t))
            )
        }
        ;(C.fn = C.prototype =
            {
                jquery: s,
                constructor: C,
                selector: "",
                length: 0,
                toArray: function () {
                    return u.call(this)
                },
                get: function (t) {
                    return null != t
                        ? t < 0
                            ? this[t + this.length]
                            : this[t]
                        : u.call(this)
                },
                pushStack: function (t) {
                    var e = C.merge(this.constructor(), t)
                    return (e.prevObject = this), (e.context = this.context), e
                },
                each: function (t, e) {
                    return C.each(this, t, e)
                },
                map: function (n) {
                    return this.pushStack(
                        C.map(this, function (t, e) {
                            return n.call(t, e, t)
                        })
                    )
                },
                slice: function () {
                    return this.pushStack(u.apply(this, arguments))
                },
                first: function () {
                    return this.eq(0)
                },
                last: function () {
                    return this.eq(-1)
                },
                eq: function (t) {
                    var e = this.length,
                        n = +t + (t < 0 ? e : 0)
                    return this.pushStack(0 <= n && n < e ? [this[n]] : [])
                },
                end: function () {
                    return this.prevObject || this.constructor(null)
                },
                push: a,
                sort: n.sort,
                splice: n.splice,
            }),
            (C.extend = C.fn.extend =
                function () {
                    var t,
                        e,
                        n,
                        r,
                        i,
                        o,
                        s = arguments[0] || {},
                        a = 1,
                        l = arguments.length,
                        c = !1
                    for (
                        "boolean" == typeof s &&
                            ((c = s), (s = arguments[a] || {}), a++),
                            "object" == typeof s || C.isFunction(s) || (s = {}),
                            a === l && ((s = this), a--);
                        a < l;
                        a++
                    )
                        if (null != (t = arguments[a]))
                            for (e in t)
                                (n = s[e]),
                                    s !== (r = t[e]) &&
                                        (c &&
                                        r &&
                                        (C.isPlainObject(r) ||
                                            (i = C.isArray(r)))
                                            ? ((o = i
                                                  ? ((i = !1),
                                                    n && C.isArray(n) ? n : [])
                                                  : n && C.isPlainObject(n)
                                                  ? n
                                                  : {}),
                                              (s[e] = C.extend(c, o, r)))
                                            : void 0 !== r && (s[e] = r))
                    return s
                }),
            C.extend({
                expando: "jQuery" + (s + Math.random()).replace(/\D/g, ""),
                isReady: !0,
                error: function (t) {
                    throw new Error(t)
                },
                noop: function () {},
                isFunction: function (t) {
                    return "function" === C.type(t)
                },
                isArray: Array.isArray,
                isWindow: function (t) {
                    return null != t && t === t.window
                },
                isNumeric: function (t) {
                    return !C.isArray(t) && 0 <= t - parseFloat(t) + 1
                },
                isPlainObject: function (t) {
                    return (
                        "object" === C.type(t) &&
                        !t.nodeType &&
                        !C.isWindow(t) &&
                        !(
                            t.constructor &&
                            !m.call(t.constructor.prototype, "isPrototypeOf")
                        )
                    )
                },
                isEmptyObject: function (t) {
                    var e
                    for (e in t) return !1
                    return !0
                },
                type: function (t) {
                    return null == t
                        ? t + ""
                        : "object" == typeof t || "function" == typeof t
                        ? r[o.call(t)] || "object"
                        : typeof t
                },
                globalEval: function (t) {
                    var e,
                        n = eval
                    ;(t = C.trim(t)) &&
                        (1 === t.indexOf("use strict")
                            ? (((e = y.createElement("script")).text = t),
                              y.head.appendChild(e).parentNode.removeChild(e))
                            : n(t))
                },
                camelCase: function (t) {
                    return t.replace(c, "ms-").replace(p, e)
                },
                nodeName: function (t, e) {
                    return (
                        t.nodeName &&
                        t.nodeName.toLowerCase() === e.toLowerCase()
                    )
                },
                each: function (t, e, n) {
                    var r = 0,
                        i = t.length,
                        o = h(t)
                    if (n) {
                        if (o) for (; r < i && !1 !== e.apply(t[r], n); r++);
                        else for (r in t) if (!1 === e.apply(t[r], n)) break
                    } else if (o)
                        for (; r < i && !1 !== e.call(t[r], r, t[r]); r++);
                    else for (r in t) if (!1 === e.call(t[r], r, t[r])) break
                    return t
                },
                trim: function (t) {
                    return null == t ? "" : (t + "").replace(l, "")
                },
                makeArray: function (t, e) {
                    var n = e || []
                    return (
                        null != t &&
                            (h(Object(t))
                                ? C.merge(n, "string" == typeof t ? [t] : t)
                                : a.call(n, t)),
                        n
                    )
                },
                inArray: function (t, e, n) {
                    return null == e ? -1 : i.call(e, t, n)
                },
                merge: function (t, e) {
                    for (var n = +e.length, r = 0, i = t.length; r < n; r++)
                        t[i++] = e[r]
                    return (t.length = i), t
                },
                grep: function (t, e, n) {
                    for (var r = [], i = 0, o = t.length, s = !n; i < o; i++)
                        !e(t[i], i) != s && r.push(t[i])
                    return r
                },
                map: function (t, e, n) {
                    var r,
                        i = 0,
                        o = t.length,
                        s = []
                    if (h(t))
                        for (; i < o; i++)
                            null != (r = e(t[i], i, n)) && s.push(r)
                    else for (i in t) null != (r = e(t[i], i, n)) && s.push(r)
                    return g.apply([], s)
                },
                guid: 1,
                proxy: function (t, e) {
                    var n, r, i
                    return (
                        "string" == typeof e && ((n = t[e]), (e = t), (t = n)),
                        C.isFunction(t)
                            ? ((r = u.call(arguments, 2)),
                              ((i = function () {
                                  return t.apply(
                                      e || this,
                                      r.concat(u.call(arguments))
                                  )
                              }).guid = t.guid =
                                  t.guid || C.guid++),
                              i)
                            : void 0
                    )
                },
                now: Date.now,
                support: v,
            }),
            C.each(
                "Boolean Number String Function Array Date RegExp Object Error".split(
                    " "
                ),
                function (t, e) {
                    r["[object " + e + "]"] = e.toLowerCase()
                }
            )
        var d = (function (n) {
            function p(t, e, n) {
                var r = "0x" + e - 65536
                return r != r || n
                    ? e
                    : r < 0
                    ? String.fromCharCode(65536 + r)
                    : String.fromCharCode((r >> 10) | 55296, (1023 & r) | 56320)
            }
            function r() {
                v()
            }
            var t,
                f,
                w,
                o,
                i,
                g,
                h,
                m,
                x,
                c,
                u,
                v,
                T,
                s,
                y,
                b,
                a,
                d,
                C,
                S = "sizzle" + +new Date(),
                E = n.document,
                k = 0,
                A = 0,
                l = ot(),
                _ = ot(),
                $ = ot(),
                N = function (t, e) {
                    return t === e && (u = !0), 0
                },
                D = {}.hasOwnProperty,
                e = [],
                j = e.pop,
                q = e.push,
                I = e.push,
                O = e.slice,
                P = function (t, e) {
                    for (var n = 0, r = t.length; n < r; n++)
                        if (t[n] === e) return n
                    return -1
                },
                R =
                    "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                L = "[\\x20\\t\\r\\n\\f]",
                H = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                F = H.replace("w", "w#"),
                Q =
                    "\\[" +
                    L +
                    "*(" +
                    H +
                    ")(?:" +
                    L +
                    "*([*^$|!~]?=)" +
                    L +
                    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
                    F +
                    "))|)" +
                    L +
                    "*\\]",
                U =
                    ":(" +
                    H +
                    ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
                    Q +
                    ")*)|.*)\\)|)",
                B = new RegExp(L + "+", "g"),
                M = new RegExp(
                    "^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$",
                    "g"
                ),
                W = new RegExp("^" + L + "*," + L + "*"),
                z = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"),
                V = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]", "g"),
                X = new RegExp(U),
                G = new RegExp("^" + F + "$"),
                Y = {
                    ID: new RegExp("^#(" + H + ")"),
                    CLASS: new RegExp("^\\.(" + H + ")"),
                    TAG: new RegExp("^(" + H.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + Q),
                    PSEUDO: new RegExp("^" + U),
                    CHILD: new RegExp(
                        "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                            L +
                            "*(even|odd|(([+-]|)(\\d*)n|)" +
                            L +
                            "*(?:([+-]|)" +
                            L +
                            "*(\\d+)|))" +
                            L +
                            "*\\)|)",
                        "i"
                    ),
                    bool: new RegExp("^(?:" + R + ")$", "i"),
                    needsContext: new RegExp(
                        "^" +
                            L +
                            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                            L +
                            "*((?:-\\d)?\\d*)" +
                            L +
                            "*\\)|)(?=[^-]|$)",
                        "i"
                    ),
                },
                J = /^(?:input|select|textarea|button)$/i,
                Z = /^h\d$/i,
                K = /^[^{]+\{\s*\[native \w/,
                tt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                et = /[+~]/,
                nt = /'|\\/g,
                rt = new RegExp(
                    "\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)",
                    "ig"
                )
            try {
                I.apply((e = O.call(E.childNodes)), E.childNodes),
                    e[E.childNodes.length].nodeType
            } catch (t) {
                I = {
                    apply: e.length
                        ? function (t, e) {
                              q.apply(t, O.call(e))
                          }
                        : function (t, e) {
                              for (
                                  var n = t.length, r = 0;
                                  (t[n++] = e[r++]);

                              );
                              t.length = n - 1
                          },
                }
            }
            function it(t, e, n, r) {
                var i, o, s, a, l, c, u, p, h, d
                if (
                    ((e ? e.ownerDocument || e : E) !== T && v(e),
                    (n = n || []),
                    (a = (e = e || T).nodeType),
                    "string" != typeof t ||
                        !t ||
                        (1 !== a && 9 !== a && 11 !== a))
                )
                    return n
                if (!r && y) {
                    if (11 !== a && (i = tt.exec(t)))
                        if ((s = i[1])) {
                            if (9 === a) {
                                if (!(o = e.getElementById(s)) || !o.parentNode)
                                    return n
                                if (o.id === s) return n.push(o), n
                            } else if (
                                e.ownerDocument &&
                                (o = e.ownerDocument.getElementById(s)) &&
                                C(e, o) &&
                                o.id === s
                            )
                                return n.push(o), n
                        } else {
                            if (i[2])
                                return I.apply(n, e.getElementsByTagName(t)), n
                            if ((s = i[3]) && f.getElementsByClassName)
                                return (
                                    I.apply(n, e.getElementsByClassName(s)), n
                                )
                        }
                    if (f.qsa && (!b || !b.test(t))) {
                        if (
                            ((p = u = S),
                            (h = e),
                            (d = 1 !== a && t),
                            1 === a && "object" !== e.nodeName.toLowerCase())
                        ) {
                            for (
                                c = g(t),
                                    (u = e.getAttribute("id"))
                                        ? (p = u.replace(nt, "\\$&"))
                                        : e.setAttribute("id", p),
                                    p = "[id='" + p + "'] ",
                                    l = c.length;
                                l--;

                            )
                                c[l] = p + dt(c[l])
                            ;(h = (et.test(t) && pt(e.parentNode)) || e),
                                (d = c.join(","))
                        }
                        if (d)
                            try {
                                return I.apply(n, h.querySelectorAll(d)), n
                            } catch (t) {
                            } finally {
                                u || e.removeAttribute("id")
                            }
                    }
                }
                return m(t.replace(M, "$1"), e, n, r)
            }
            function ot() {
                var n = []
                function r(t, e) {
                    return (
                        n.push(t + " ") > w.cacheLength && delete r[n.shift()],
                        (r[t + " "] = e)
                    )
                }
                return r
            }
            function st(t) {
                return (t[S] = !0), t
            }
            function at(t) {
                var e = T.createElement("div")
                try {
                    return !!t(e)
                } catch (t) {
                    return !1
                } finally {
                    e.parentNode && e.parentNode.removeChild(e), (e = null)
                }
            }
            function lt(t, e) {
                for (var n = t.split("|"), r = t.length; r--; )
                    w.attrHandle[n[r]] = e
            }
            function ct(t, e) {
                var n = e && t,
                    r =
                        n &&
                        1 === t.nodeType &&
                        1 === e.nodeType &&
                        (~e.sourceIndex || 1 << 31) -
                            (~t.sourceIndex || 1 << 31)
                if (r) return r
                if (n) for (; (n = n.nextSibling); ) if (n === e) return -1
                return t ? 1 : -1
            }
            function ut(s) {
                return st(function (o) {
                    return (
                        (o = +o),
                        st(function (t, e) {
                            for (
                                var n, r = s([], t.length, o), i = r.length;
                                i--;

                            )
                                t[(n = r[i])] && (t[n] = !(e[n] = t[n]))
                        })
                    )
                })
            }
            function pt(t) {
                return t && void 0 !== t.getElementsByTagName && t
            }
            for (t in ((f = it.support = {}),
            (i = it.isXML =
                function (t) {
                    var e = t && (t.ownerDocument || t).documentElement
                    return !!e && "HTML" !== e.nodeName
                }),
            (v = it.setDocument =
                function (t) {
                    var e,
                        n,
                        l = t ? t.ownerDocument || t : E
                    return l !== T && 9 === l.nodeType && l.documentElement
                        ? ((s = (T = l).documentElement),
                          (n = l.defaultView) &&
                              n !== n.top &&
                              (n.addEventListener
                                  ? n.addEventListener("unload", r, !1)
                                  : n.attachEvent &&
                                    n.attachEvent("onunload", r)),
                          (y = !i(l)),
                          (f.attributes = at(function (t) {
                              return (
                                  (t.className = "i"),
                                  !t.getAttribute("className")
                              )
                          })),
                          (f.getElementsByTagName = at(function (t) {
                              return (
                                  t.appendChild(l.createComment("")),
                                  !t.getElementsByTagName("*").length
                              )
                          })),
                          (f.getElementsByClassName = K.test(
                              l.getElementsByClassName
                          )),
                          (f.getById = at(function (t) {
                              return (
                                  (s.appendChild(t).id = S),
                                  !l.getElementsByName ||
                                      !l.getElementsByName(S).length
                              )
                          })),
                          f.getById
                              ? ((w.find.ID = function (t, e) {
                                    if (void 0 !== e.getElementById && y) {
                                        var n = e.getElementById(t)
                                        return n && n.parentNode ? [n] : []
                                    }
                                }),
                                (w.filter.ID = function (t) {
                                    var e = t.replace(rt, p)
                                    return function (t) {
                                        return t.getAttribute("id") === e
                                    }
                                }))
                              : (delete w.find.ID,
                                (w.filter.ID = function (t) {
                                    var n = t.replace(rt, p)
                                    return function (t) {
                                        var e =
                                            void 0 !== t.getAttributeNode &&
                                            t.getAttributeNode("id")
                                        return e && e.value === n
                                    }
                                })),
                          (w.find.TAG = f.getElementsByTagName
                              ? function (t, e) {
                                    return void 0 !== e.getElementsByTagName
                                        ? e.getElementsByTagName(t)
                                        : f.qsa
                                        ? e.querySelectorAll(t)
                                        : void 0
                                }
                              : function (t, e) {
                                    var n,
                                        r = [],
                                        i = 0,
                                        o = e.getElementsByTagName(t)
                                    if ("*" !== t) return o
                                    for (; (n = o[i++]); )
                                        1 === n.nodeType && r.push(n)
                                    return r
                                }),
                          (w.find.CLASS =
                              f.getElementsByClassName &&
                              function (t, e) {
                                  return y
                                      ? e.getElementsByClassName(t)
                                      : void 0
                              }),
                          (a = []),
                          (b = []),
                          (f.qsa = K.test(l.querySelectorAll)) &&
                              (at(function (t) {
                                  ;(s.appendChild(t).innerHTML =
                                      "<a id='" +
                                      S +
                                      "'></a><select id='" +
                                      S +
                                      "-\f]' msallowcapture=''><option selected=''></option></select>"),
                                      t.querySelectorAll("[msallowcapture^='']")
                                          .length &&
                                          b.push("[*^$]=" + L + "*(?:''|\"\")"),
                                      t.querySelectorAll("[selected]").length ||
                                          b.push(
                                              "\\[" + L + "*(?:value|" + R + ")"
                                          ),
                                      t.querySelectorAll("[id~=" + S + "-]")
                                          .length || b.push("~="),
                                      t.querySelectorAll(":checked").length ||
                                          b.push(":checked"),
                                      t.querySelectorAll("a#" + S + "+*")
                                          .length || b.push(".#.+[+~]")
                              }),
                              at(function (t) {
                                  var e = l.createElement("input")
                                  e.setAttribute("type", "hidden"),
                                      t
                                          .appendChild(e)
                                          .setAttribute("name", "D"),
                                      t.querySelectorAll("[name=d]").length &&
                                          b.push("name" + L + "*[*^$|!~]?="),
                                      t.querySelectorAll(":enabled").length ||
                                          b.push(":enabled", ":disabled"),
                                      t.querySelectorAll("*,:x"),
                                      b.push(",.*:")
                              })),
                          (f.matchesSelector = K.test(
                              (d =
                                  s.matches ||
                                  s.webkitMatchesSelector ||
                                  s.mozMatchesSelector ||
                                  s.oMatchesSelector ||
                                  s.msMatchesSelector)
                          )) &&
                              at(function (t) {
                                  ;(f.disconnectedMatch = d.call(t, "div")),
                                      d.call(t, "[s!='']:x"),
                                      a.push("!=", U)
                              }),
                          (b = b.length && new RegExp(b.join("|"))),
                          (a = a.length && new RegExp(a.join("|"))),
                          (e = K.test(s.compareDocumentPosition)),
                          (C =
                              e || K.test(s.contains)
                                  ? function (t, e) {
                                        var n =
                                                9 === t.nodeType
                                                    ? t.documentElement
                                                    : t,
                                            r = e && e.parentNode
                                        return (
                                            t === r ||
                                            !(
                                                !r ||
                                                1 !== r.nodeType ||
                                                !(n.contains
                                                    ? n.contains(r)
                                                    : t.compareDocumentPosition &&
                                                      16 &
                                                          t.compareDocumentPosition(
                                                              r
                                                          ))
                                            )
                                        )
                                    }
                                  : function (t, e) {
                                        if (e)
                                            for (; (e = e.parentNode); )
                                                if (e === t) return !0
                                        return !1
                                    }),
                          (N = e
                              ? function (t, e) {
                                    if (t === e) return (u = !0), 0
                                    var n =
                                        !t.compareDocumentPosition -
                                        !e.compareDocumentPosition
                                    return (
                                        n ||
                                        (1 &
                                            (n =
                                                (t.ownerDocument || t) ===
                                                (e.ownerDocument || e)
                                                    ? t.compareDocumentPosition(
                                                          e
                                                      )
                                                    : 1) ||
                                        (!f.sortDetached &&
                                            e.compareDocumentPosition(t) === n)
                                            ? t === l ||
                                              (t.ownerDocument === E && C(E, t))
                                                ? -1
                                                : e === l ||
                                                  (e.ownerDocument === E &&
                                                      C(E, e))
                                                ? 1
                                                : c
                                                ? P(c, t) - P(c, e)
                                                : 0
                                            : 4 & n
                                            ? -1
                                            : 1)
                                    )
                                }
                              : function (t, e) {
                                    if (t === e) return (u = !0), 0
                                    var n,
                                        r = 0,
                                        i = t.parentNode,
                                        o = e.parentNode,
                                        s = [t],
                                        a = [e]
                                    if (!i || !o)
                                        return t === l
                                            ? -1
                                            : e === l
                                            ? 1
                                            : i
                                            ? -1
                                            : o
                                            ? 1
                                            : c
                                            ? P(c, t) - P(c, e)
                                            : 0
                                    if (i === o) return ct(t, e)
                                    for (n = t; (n = n.parentNode); )
                                        s.unshift(n)
                                    for (n = e; (n = n.parentNode); )
                                        a.unshift(n)
                                    for (; s[r] === a[r]; ) r++
                                    return r
                                        ? ct(s[r], a[r])
                                        : s[r] === E
                                        ? -1
                                        : a[r] === E
                                        ? 1
                                        : 0
                                }),
                          l)
                        : T
                }),
            (it.matches = function (t, e) {
                return it(t, null, null, e)
            }),
            (it.matchesSelector = function (t, e) {
                if (
                    ((t.ownerDocument || t) !== T && v(t),
                    (e = e.replace(V, "='$1']")),
                    !(
                        !f.matchesSelector ||
                        !y ||
                        (a && a.test(e)) ||
                        (b && b.test(e))
                    ))
                )
                    try {
                        var n = d.call(t, e)
                        if (
                            n ||
                            f.disconnectedMatch ||
                            (t.document && 11 !== t.document.nodeType)
                        )
                            return n
                    } catch (t) {}
                return 0 < it(e, T, null, [t]).length
            }),
            (it.contains = function (t, e) {
                return (t.ownerDocument || t) !== T && v(t), C(t, e)
            }),
            (it.attr = function (t, e) {
                ;(t.ownerDocument || t) !== T && v(t)
                var n = w.attrHandle[e.toLowerCase()],
                    r =
                        n && D.call(w.attrHandle, e.toLowerCase())
                            ? n(t, e, !y)
                            : void 0
                return void 0 !== r
                    ? r
                    : f.attributes || !y
                    ? t.getAttribute(e)
                    : (r = t.getAttributeNode(e)) && r.specified
                    ? r.value
                    : null
            }),
            (it.error = function (t) {
                throw new Error("Syntax error, unrecognized expression: " + t)
            }),
            (it.uniqueSort = function (t) {
                var e,
                    n = [],
                    r = 0,
                    i = 0
                if (
                    ((u = !f.detectDuplicates),
                    (c = !f.sortStable && t.slice(0)),
                    t.sort(N),
                    u)
                ) {
                    for (; (e = t[i++]); ) e === t[i] && (r = n.push(i))
                    for (; r--; ) t.splice(n[r], 1)
                }
                return (c = null), t
            }),
            (o = it.getText =
                function (t) {
                    var e,
                        n = "",
                        r = 0,
                        i = t.nodeType
                    if (i) {
                        if (1 === i || 9 === i || 11 === i) {
                            if ("string" == typeof t.textContent)
                                return t.textContent
                            for (t = t.firstChild; t; t = t.nextSibling)
                                n += o(t)
                        } else if (3 === i || 4 === i) return t.nodeValue
                    } else for (; (e = t[r++]); ) n += o(e)
                    return n
                }),
            ((w = it.selectors =
                {
                    cacheLength: 50,
                    createPseudo: st,
                    match: Y,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": { dir: "parentNode", first: !0 },
                        " ": { dir: "parentNode" },
                        "+": { dir: "previousSibling", first: !0 },
                        "~": { dir: "previousSibling" },
                    },
                    preFilter: {
                        ATTR: function (t) {
                            return (
                                (t[1] = t[1].replace(rt, p)),
                                (t[3] = (t[3] || t[4] || t[5] || "").replace(
                                    rt,
                                    p
                                )),
                                "~=" === t[2] && (t[3] = " " + t[3] + " "),
                                t.slice(0, 4)
                            )
                        },
                        CHILD: function (t) {
                            return (
                                (t[1] = t[1].toLowerCase()),
                                "nth" === t[1].slice(0, 3)
                                    ? (t[3] || it.error(t[0]),
                                      (t[4] = +(t[4]
                                          ? t[5] + (t[6] || 1)
                                          : 2 *
                                            ("even" === t[3] ||
                                                "odd" === t[3]))),
                                      (t[5] = +(t[7] + t[8] || "odd" === t[3])))
                                    : t[3] && it.error(t[0]),
                                t
                            )
                        },
                        PSEUDO: function (t) {
                            var e,
                                n = !t[6] && t[2]
                            return Y.CHILD.test(t[0])
                                ? null
                                : (t[3]
                                      ? (t[2] = t[4] || t[5] || "")
                                      : n &&
                                        X.test(n) &&
                                        (e = g(n, !0)) &&
                                        (e =
                                            n.indexOf(")", n.length - e) -
                                            n.length) &&
                                        ((t[0] = t[0].slice(0, e)),
                                        (t[2] = n.slice(0, e))),
                                  t.slice(0, 3))
                        },
                    },
                    filter: {
                        TAG: function (t) {
                            var e = t.replace(rt, p).toLowerCase()
                            return "*" === t
                                ? function () {
                                      return !0
                                  }
                                : function (t) {
                                      return (
                                          t.nodeName &&
                                          t.nodeName.toLowerCase() === e
                                      )
                                  }
                        },
                        CLASS: function (t) {
                            var e = l[t + " "]
                            return (
                                e ||
                                ((e = new RegExp(
                                    "(^|" + L + ")" + t + "(" + L + "|$)"
                                )) &&
                                    l(t, function (t) {
                                        return e.test(
                                            ("string" == typeof t.className &&
                                                t.className) ||
                                                (void 0 !== t.getAttribute &&
                                                    t.getAttribute("class")) ||
                                                ""
                                        )
                                    }))
                            )
                        },
                        ATTR: function (n, r, i) {
                            return function (t) {
                                var e = it.attr(t, n)
                                return null == e
                                    ? "!=" === r
                                    : !r ||
                                          ((e += ""),
                                          "=" === r
                                              ? e === i
                                              : "!=" === r
                                              ? e !== i
                                              : "^=" === r
                                              ? i && 0 === e.indexOf(i)
                                              : "*=" === r
                                              ? i && -1 < e.indexOf(i)
                                              : "$=" === r
                                              ? i && e.slice(-i.length) === i
                                              : "~=" === r
                                              ? -1 <
                                                (
                                                    " " +
                                                    e.replace(B, " ") +
                                                    " "
                                                ).indexOf(i)
                                              : "|=" === r &&
                                                (e === i ||
                                                    e.slice(0, i.length + 1) ===
                                                        i + "-"))
                            }
                        },
                        CHILD: function (d, t, e, f, g) {
                            var m = "nth" !== d.slice(0, 3),
                                v = "last" !== d.slice(-4),
                                y = "of-type" === t
                            return 1 === f && 0 === g
                                ? function (t) {
                                      return !!t.parentNode
                                  }
                                : function (t, e, n) {
                                      var r,
                                          i,
                                          o,
                                          s,
                                          a,
                                          l,
                                          c =
                                              m != v
                                                  ? "nextSibling"
                                                  : "previousSibling",
                                          u = t.parentNode,
                                          p = y && t.nodeName.toLowerCase(),
                                          h = !n && !y
                                      if (u) {
                                          if (m) {
                                              for (; c; ) {
                                                  for (o = t; (o = o[c]); )
                                                      if (
                                                          y
                                                              ? o.nodeName.toLowerCase() ===
                                                                p
                                                              : 1 === o.nodeType
                                                      )
                                                          return !1
                                                  l = c =
                                                      "only" === d &&
                                                      !l &&
                                                      "nextSibling"
                                              }
                                              return !0
                                          }
                                          if (
                                              ((l = [
                                                  v
                                                      ? u.firstChild
                                                      : u.lastChild,
                                              ]),
                                              v && h)
                                          ) {
                                              for (
                                                  a =
                                                      (r =
                                                          (i =
                                                              u[S] ||
                                                              (u[S] = {}))[d] ||
                                                          [])[0] === k && r[1],
                                                      s = r[0] === k && r[2],
                                                      o = a && u.childNodes[a];
                                                  (o =
                                                      (++a && o && o[c]) ||
                                                      (s = a = 0) ||
                                                      l.pop());

                                              )
                                                  if (
                                                      1 === o.nodeType &&
                                                      ++s &&
                                                      o === t
                                                  ) {
                                                      i[d] = [k, a, s]
                                                      break
                                                  }
                                          } else if (
                                              h &&
                                              (r = (t[S] || (t[S] = {}))[d]) &&
                                              r[0] === k
                                          )
                                              s = r[1]
                                          else
                                              for (
                                                  ;
                                                  (o =
                                                      (++a && o && o[c]) ||
                                                      (s = a = 0) ||
                                                      l.pop()) &&
                                                  ((y
                                                      ? o.nodeName.toLowerCase() !==
                                                        p
                                                      : 1 !== o.nodeType) ||
                                                      !++s ||
                                                      (h &&
                                                          ((o[S] ||
                                                              (o[S] = {}))[d] =
                                                              [k, s]),
                                                      o !== t));

                                              );
                                          return (
                                              (s -= g) === f ||
                                              (s % f == 0 && 0 <= s / f)
                                          )
                                      }
                                  }
                        },
                        PSEUDO: function (t, o) {
                            var e,
                                s =
                                    w.pseudos[t] ||
                                    w.setFilters[t.toLowerCase()] ||
                                    it.error("unsupported pseudo: " + t)
                            return s[S]
                                ? s(o)
                                : 1 < s.length
                                ? ((e = [t, t, "", o]),
                                  w.setFilters.hasOwnProperty(t.toLowerCase())
                                      ? st(function (t, e) {
                                            for (
                                                var n,
                                                    r = s(t, o),
                                                    i = r.length;
                                                i--;

                                            )
                                                t[(n = P(t, r[i]))] = !(e[n] =
                                                    r[i])
                                        })
                                      : function (t) {
                                            return s(t, 0, e)
                                        })
                                : s
                        },
                    },
                    pseudos: {
                        not: st(function (t) {
                            var r = [],
                                i = [],
                                a = h(t.replace(M, "$1"))
                            return a[S]
                                ? st(function (t, e, n, r) {
                                      for (
                                          var i,
                                              o = a(t, null, r, []),
                                              s = t.length;
                                          s--;

                                      )
                                          (i = o[s]) && (t[s] = !(e[s] = i))
                                  })
                                : function (t, e, n) {
                                      return (
                                          (r[0] = t),
                                          a(r, null, n, i),
                                          (r[0] = null),
                                          !i.pop()
                                      )
                                  }
                        }),
                        has: st(function (e) {
                            return function (t) {
                                return 0 < it(e, t).length
                            }
                        }),
                        contains: st(function (e) {
                            return (
                                (e = e.replace(rt, p)),
                                function (t) {
                                    return (
                                        -1 <
                                        (
                                            t.textContent ||
                                            t.innerText ||
                                            o(t)
                                        ).indexOf(e)
                                    )
                                }
                            )
                        }),
                        lang: st(function (n) {
                            return (
                                G.test(n || "") ||
                                    it.error("unsupported lang: " + n),
                                (n = n.replace(rt, p).toLowerCase()),
                                function (t) {
                                    var e
                                    do {
                                        if (
                                            (e = y
                                                ? t.lang
                                                : t.getAttribute("xml:lang") ||
                                                  t.getAttribute("lang"))
                                        )
                                            return (
                                                (e = e.toLowerCase()) === n ||
                                                0 === e.indexOf(n + "-")
                                            )
                                    } while (
                                        (t = t.parentNode) &&
                                        1 === t.nodeType
                                    )
                                    return !1
                                }
                            )
                        }),
                        target: function (t) {
                            var e = n.location && n.location.hash
                            return e && e.slice(1) === t.id
                        },
                        root: function (t) {
                            return t === s
                        },
                        focus: function (t) {
                            return (
                                t === T.activeElement &&
                                (!T.hasFocus || T.hasFocus()) &&
                                !!(t.type || t.href || ~t.tabIndex)
                            )
                        },
                        enabled: function (t) {
                            return !1 === t.disabled
                        },
                        disabled: function (t) {
                            return !0 === t.disabled
                        },
                        checked: function (t) {
                            var e = t.nodeName.toLowerCase()
                            return (
                                ("input" === e && !!t.checked) ||
                                ("option" === e && !!t.selected)
                            )
                        },
                        selected: function (t) {
                            return (
                                t.parentNode && t.parentNode.selectedIndex,
                                !0 === t.selected
                            )
                        },
                        empty: function (t) {
                            for (t = t.firstChild; t; t = t.nextSibling)
                                if (t.nodeType < 6) return !1
                            return !0
                        },
                        parent: function (t) {
                            return !w.pseudos.empty(t)
                        },
                        header: function (t) {
                            return Z.test(t.nodeName)
                        },
                        input: function (t) {
                            return J.test(t.nodeName)
                        },
                        button: function (t) {
                            var e = t.nodeName.toLowerCase()
                            return (
                                ("input" === e && "button" === t.type) ||
                                "button" === e
                            )
                        },
                        text: function (t) {
                            var e
                            return (
                                "input" === t.nodeName.toLowerCase() &&
                                "text" === t.type &&
                                (null == (e = t.getAttribute("type")) ||
                                    "text" === e.toLowerCase())
                            )
                        },
                        first: ut(function () {
                            return [0]
                        }),
                        last: ut(function (t, e) {
                            return [e - 1]
                        }),
                        eq: ut(function (t, e, n) {
                            return [n < 0 ? n + e : n]
                        }),
                        even: ut(function (t, e) {
                            for (var n = 0; n < e; n += 2) t.push(n)
                            return t
                        }),
                        odd: ut(function (t, e) {
                            for (var n = 1; n < e; n += 2) t.push(n)
                            return t
                        }),
                        lt: ut(function (t, e, n) {
                            for (var r = n < 0 ? n + e : n; 0 <= --r; )
                                t.push(r)
                            return t
                        }),
                        gt: ut(function (t, e, n) {
                            for (var r = n < 0 ? n + e : n; ++r < e; ) t.push(r)
                            return t
                        }),
                    },
                }).pseudos.nth = w.pseudos.eq),
            { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
                w.pseudos[t] = (function (e) {
                    return function (t) {
                        return (
                            "input" === t.nodeName.toLowerCase() && t.type === e
                        )
                    }
                })(t)
            for (t in { submit: !0, reset: !0 })
                w.pseudos[t] = (function (n) {
                    return function (t) {
                        var e = t.nodeName.toLowerCase()
                        return ("input" === e || "button" === e) && t.type === n
                    }
                })(t)
            function ht() {}
            function dt(t) {
                for (var e = 0, n = t.length, r = ""; e < n; e++)
                    r += t[e].value
                return r
            }
            function ft(s, t, e) {
                var a = t.dir,
                    l = e && "parentNode" === a,
                    c = A++
                return t.first
                    ? function (t, e, n) {
                          for (; (t = t[a]); )
                              if (1 === t.nodeType || l) return s(t, e, n)
                      }
                    : function (t, e, n) {
                          var r,
                              i,
                              o = [k, c]
                          if (n) {
                              for (; (t = t[a]); )
                                  if ((1 === t.nodeType || l) && s(t, e, n))
                                      return !0
                          } else
                              for (; (t = t[a]); )
                                  if (1 === t.nodeType || l) {
                                      if (
                                          (r = (i = t[S] || (t[S] = {}))[a]) &&
                                          r[0] === k &&
                                          r[1] === c
                                      )
                                          return (o[2] = r[2])
                                      if (((i[a] = o)[2] = s(t, e, n)))
                                          return !0
                                  }
                      }
            }
            function gt(i) {
                return 1 < i.length
                    ? function (t, e, n) {
                          for (var r = i.length; r--; )
                              if (!i[r](t, e, n)) return !1
                          return !0
                      }
                    : i[0]
            }
            function mt(t, e, n, r, i) {
                for (
                    var o, s = [], a = 0, l = t.length, c = null != e;
                    a < l;
                    a++
                )
                    !(o = t[a]) ||
                        (n && !n(o, r, i)) ||
                        (s.push(o), c && e.push(a))
                return s
            }
            function vt(d, f, g, m, v, t) {
                return (
                    m && !m[S] && (m = vt(m)),
                    v && !v[S] && (v = vt(v, t)),
                    st(function (t, e, n, r) {
                        var i,
                            o,
                            s,
                            a = [],
                            l = [],
                            c = e.length,
                            u =
                                t ||
                                (function (t, e, n) {
                                    for (var r = 0, i = e.length; r < i; r++)
                                        it(t, e[r], n)
                                    return n
                                })(f || "*", n.nodeType ? [n] : n, []),
                            p = !d || (!t && f) ? u : mt(u, a, d, n, r),
                            h = g ? (v || (t ? d : c || m) ? [] : e) : p
                        if ((g && g(p, h, n, r), m))
                            for (
                                i = mt(h, l), m(i, [], n, r), o = i.length;
                                o--;

                            )
                                (s = i[o]) && (h[l[o]] = !(p[l[o]] = s))
                        if (t) {
                            if (v || d) {
                                if (v) {
                                    for (i = [], o = h.length; o--; )
                                        (s = h[o]) && i.push((p[o] = s))
                                    v(null, (h = []), i, r)
                                }
                                for (o = h.length; o--; )
                                    (s = h[o]) &&
                                        -1 < (i = v ? P(t, s) : a[o]) &&
                                        (t[i] = !(e[i] = s))
                            }
                        } else (h = mt(h === e ? h.splice(c, h.length) : h)), v ? v(null, e, h, r) : I.apply(e, h)
                    })
                )
            }
            function yt(m, v) {
                function t(t, e, n, r, i) {
                    var o,
                        s,
                        a,
                        l = 0,
                        c = "0",
                        u = t && [],
                        p = [],
                        h = x,
                        d = t || (b && w.find.TAG("*", i)),
                        f = (k += null == h ? 1 : Math.random() || 0.1),
                        g = d.length
                    for (
                        i && (x = e !== T && e);
                        c !== g && null != (o = d[c]);
                        c++
                    ) {
                        if (b && o) {
                            for (s = 0; (a = m[s++]); )
                                if (a(o, e, n)) {
                                    r.push(o)
                                    break
                                }
                            i && (k = f)
                        }
                        y && ((o = !a && o) && l--, t && u.push(o))
                    }
                    if (((l += c), y && c !== l)) {
                        for (s = 0; (a = v[s++]); ) a(u, p, e, n)
                        if (t) {
                            if (0 < l)
                                for (; c--; ) u[c] || p[c] || (p[c] = j.call(r))
                            p = mt(p)
                        }
                        I.apply(r, p),
                            i &&
                                !t &&
                                0 < p.length &&
                                1 < l + v.length &&
                                it.uniqueSort(r)
                    }
                    return i && ((k = f), (x = h)), u
                }
                var y = 0 < v.length,
                    b = 0 < m.length
                return y ? st(t) : t
            }
            return (
                (ht.prototype = w.filters = w.pseudos),
                (w.setFilters = new ht()),
                (g = it.tokenize =
                    function (t, e) {
                        var n,
                            r,
                            i,
                            o,
                            s,
                            a,
                            l,
                            c = _[t + " "]
                        if (c) return e ? 0 : c.slice(0)
                        for (s = t, a = [], l = w.preFilter; s; ) {
                            for (o in ((n && !(r = W.exec(s))) ||
                                (r && (s = s.slice(r[0].length) || s),
                                a.push((i = []))),
                            (n = !1),
                            (r = z.exec(s)) &&
                                ((n = r.shift()),
                                i.push({
                                    value: n,
                                    type: r[0].replace(M, " "),
                                }),
                                (s = s.slice(n.length))),
                            w.filter))
                                !(r = Y[o].exec(s)) ||
                                    (l[o] && !(r = l[o](r))) ||
                                    ((n = r.shift()),
                                    i.push({ value: n, type: o, matches: r }),
                                    (s = s.slice(n.length)))
                            if (!n) break
                        }
                        return e ? s.length : s ? it.error(t) : _(t, a).slice(0)
                    }),
                (h = it.compile =
                    function (t, e) {
                        var n,
                            r = [],
                            i = [],
                            o = $[t + " "]
                        if (!o) {
                            for (n = (e = e || g(t)).length; n--; )
                                (o = (function t(e) {
                                    for (
                                        var i,
                                            n,
                                            r,
                                            o = e.length,
                                            s = w.relative[e[0].type],
                                            a = s || w.relative[" "],
                                            l = s ? 1 : 0,
                                            c = ft(
                                                function (t) {
                                                    return t === i
                                                },
                                                a,
                                                !0
                                            ),
                                            u = ft(
                                                function (t) {
                                                    return -1 < P(i, t)
                                                },
                                                a,
                                                !0
                                            ),
                                            p = [
                                                function (t, e, n) {
                                                    var r =
                                                        (!s &&
                                                            (n || e !== x)) ||
                                                        ((i = e).nodeType
                                                            ? c
                                                            : u)(t, e, n)
                                                    return (i = null), r
                                                },
                                            ];
                                        l < o;
                                        l++
                                    )
                                        if ((n = w.relative[e[l].type]))
                                            p = [ft(gt(p), n)]
                                        else {
                                            if (
                                                (n = w.filter[e[l].type].apply(
                                                    null,
                                                    e[l].matches
                                                ))[S]
                                            ) {
                                                for (
                                                    r = ++l;
                                                    r < o &&
                                                    !w.relative[e[r].type];
                                                    r++
                                                );
                                                return vt(
                                                    1 < l && gt(p),
                                                    1 < l &&
                                                        dt(
                                                            e
                                                                .slice(0, l - 1)
                                                                .concat({
                                                                    value:
                                                                        " " ===
                                                                        e[l - 2]
                                                                            .type
                                                                            ? "*"
                                                                            : "",
                                                                })
                                                        ).replace(M, "$1"),
                                                    n,
                                                    l < r && t(e.slice(l, r)),
                                                    r < o &&
                                                        t((e = e.slice(r))),
                                                    r < o && dt(e)
                                                )
                                            }
                                            p.push(n)
                                        }
                                    return gt(p)
                                })(e[n]))[S]
                                    ? r.push(o)
                                    : i.push(o)
                            ;(o = $(t, yt(i, r))).selector = t
                        }
                        return o
                    }),
                (m = it.select =
                    function (t, e, n, r) {
                        var i,
                            o,
                            s,
                            a,
                            l,
                            c = "function" == typeof t && t,
                            u = !r && g((t = c.selector || t))
                        if (((n = n || []), 1 === u.length)) {
                            if (
                                2 < (o = u[0] = u[0].slice(0)).length &&
                                "ID" === (s = o[0]).type &&
                                f.getById &&
                                9 === e.nodeType &&
                                y &&
                                w.relative[o[1].type]
                            ) {
                                if (
                                    !(e = (w.find.ID(
                                        s.matches[0].replace(rt, p),
                                        e
                                    ) || [])[0])
                                )
                                    return n
                                c && (e = e.parentNode),
                                    (t = t.slice(o.shift().value.length))
                            }
                            for (
                                i = Y.needsContext.test(t) ? 0 : o.length;
                                i-- && ((s = o[i]), !w.relative[(a = s.type)]);

                            )
                                if (
                                    (l = w.find[a]) &&
                                    (r = l(
                                        s.matches[0].replace(rt, p),
                                        (et.test(o[0].type) &&
                                            pt(e.parentNode)) ||
                                            e
                                    ))
                                ) {
                                    if (
                                        (o.splice(i, 1),
                                        !(t = r.length && dt(o)))
                                    )
                                        return I.apply(n, r), n
                                    break
                                }
                        }
                        return (
                            (c || h(t, u))(
                                r,
                                e,
                                !y,
                                n,
                                (et.test(t) && pt(e.parentNode)) || e
                            ),
                            n
                        )
                    }),
                (f.sortStable = S.split("").sort(N).join("") === S),
                (f.detectDuplicates = !!u),
                v(),
                (f.sortDetached = at(function (t) {
                    return 1 & t.compareDocumentPosition(T.createElement("div"))
                })),
                at(function (t) {
                    return (
                        (t.innerHTML = "<a href='#'></a>"),
                        "#" === t.firstChild.getAttribute("href")
                    )
                }) ||
                    lt("type|href|height|width", function (t, e, n) {
                        return n
                            ? void 0
                            : t.getAttribute(
                                  e,
                                  "type" === e.toLowerCase() ? 1 : 2
                              )
                    }),
                (f.attributes &&
                    at(function (t) {
                        return (
                            (t.innerHTML = "<input/>"),
                            t.firstChild.setAttribute("value", ""),
                            "" === t.firstChild.getAttribute("value")
                        )
                    })) ||
                    lt("value", function (t, e, n) {
                        return n || "input" !== t.nodeName.toLowerCase()
                            ? void 0
                            : t.defaultValue
                    }),
                at(function (t) {
                    return null == t.getAttribute("disabled")
                }) ||
                    lt(R, function (t, e, n) {
                        var r
                        return n
                            ? void 0
                            : !0 === t[e]
                            ? e.toLowerCase()
                            : (r = t.getAttributeNode(e)) && r.specified
                            ? r.value
                            : null
                    }),
                it
            )
        })(f)
        ;(C.find = d),
            (C.expr = d.selectors),
            (C.expr[":"] = C.expr.pseudos),
            (C.unique = d.uniqueSort),
            (C.text = d.getText),
            (C.isXMLDoc = d.isXML),
            (C.contains = d.contains)
        var b = C.expr.match.needsContext,
            w = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            x = /^.[^:#\[\.,]*$/
        function T(t, n, r) {
            if (C.isFunction(n))
                return C.grep(t, function (t, e) {
                    return !!n.call(t, e, t) !== r
                })
            if (n.nodeType)
                return C.grep(t, function (t) {
                    return (t === n) !== r
                })
            if ("string" == typeof n) {
                if (x.test(n)) return C.filter(n, t, r)
                n = C.filter(n, t)
            }
            return C.grep(t, function (t) {
                return 0 <= i.call(n, t) !== r
            })
        }
        ;(C.filter = function (t, e, n) {
            var r = e[0]
            return (
                n && (t = ":not(" + t + ")"),
                1 === e.length && 1 === r.nodeType
                    ? C.find.matchesSelector(r, t)
                        ? [r]
                        : []
                    : C.find.matches(
                          t,
                          C.grep(e, function (t) {
                              return 1 === t.nodeType
                          })
                      )
            )
        }),
            C.fn.extend({
                find: function (t) {
                    var e,
                        n = this.length,
                        r = [],
                        i = this
                    if ("string" != typeof t)
                        return this.pushStack(
                            C(t).filter(function () {
                                for (e = 0; e < n; e++)
                                    if (C.contains(i[e], this)) return !0
                            })
                        )
                    for (e = 0; e < n; e++) C.find(t, i[e], r)
                    return (
                        ((r = this.pushStack(
                            1 < n ? C.unique(r) : r
                        )).selector = this.selector
                            ? this.selector + " " + t
                            : t),
                        r
                    )
                },
                filter: function (t) {
                    return this.pushStack(T(this, t || [], !1))
                },
                not: function (t) {
                    return this.pushStack(T(this, t || [], !0))
                },
                is: function (t) {
                    return !!T(
                        this,
                        "string" == typeof t && b.test(t) ? C(t) : t || [],
                        !1
                    ).length
                },
            })
        var S,
            E = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/
        ;((C.fn.init = function (t, e) {
            var n, r
            if (!t) return this
            if ("string" != typeof t)
                return t.nodeType
                    ? ((this.context = this[0] = t), (this.length = 1), this)
                    : C.isFunction(t)
                    ? void 0 !== S.ready
                        ? S.ready(t)
                        : t(C)
                    : (void 0 !== t.selector &&
                          ((this.selector = t.selector),
                          (this.context = t.context)),
                      C.makeArray(t, this))
            if (
                !(n =
                    "<" === t[0] && ">" === t[t.length - 1] && 3 <= t.length
                        ? [null, t, null]
                        : E.exec(t)) ||
                (!n[1] && e)
            )
                return !e || e.jquery
                    ? (e || S).find(t)
                    : this.constructor(e).find(t)
            if (n[1]) {
                if (
                    ((e = e instanceof C ? e[0] : e),
                    C.merge(
                        this,
                        C.parseHTML(
                            n[1],
                            e && e.nodeType ? e.ownerDocument || e : y,
                            !0
                        )
                    ),
                    w.test(n[1]) && C.isPlainObject(e))
                )
                    for (n in e)
                        C.isFunction(this[n])
                            ? this[n](e[n])
                            : this.attr(n, e[n])
                return this
            }
            return (
                (r = y.getElementById(n[2])) &&
                    r.parentNode &&
                    ((this.length = 1), (this[0] = r)),
                (this.context = y),
                (this.selector = t),
                this
            )
        }).prototype = C.fn),
            (S = C(y))
        var k = /^(?:parents|prev(?:Until|All))/,
            A = { children: !0, contents: !0, next: !0, prev: !0 }
        function _(t, e) {
            for (; (t = t[e]) && 1 !== t.nodeType; );
            return t
        }
        C.extend({
            dir: function (t, e, n) {
                for (
                    var r = [], i = void 0 !== n;
                    (t = t[e]) && 9 !== t.nodeType;

                )
                    if (1 === t.nodeType) {
                        if (i && C(t).is(n)) break
                        r.push(t)
                    }
                return r
            },
            sibling: function (t, e) {
                for (var n = []; t; t = t.nextSibling)
                    1 === t.nodeType && t !== e && n.push(t)
                return n
            },
        }),
            C.fn.extend({
                has: function (t) {
                    var e = C(t, this),
                        n = e.length
                    return this.filter(function () {
                        for (var t = 0; t < n; t++)
                            if (C.contains(this, e[t])) return !0
                    })
                },
                closest: function (t, e) {
                    for (
                        var n,
                            r = 0,
                            i = this.length,
                            o = [],
                            s =
                                b.test(t) || "string" != typeof t
                                    ? C(t, e || this.context)
                                    : 0;
                        r < i;
                        r++
                    )
                        for (n = this[r]; n && n !== e; n = n.parentNode)
                            if (
                                n.nodeType < 11 &&
                                (s
                                    ? -1 < s.index(n)
                                    : 1 === n.nodeType &&
                                      C.find.matchesSelector(n, t))
                            ) {
                                o.push(n)
                                break
                            }
                    return this.pushStack(1 < o.length ? C.unique(o) : o)
                },
                index: function (t) {
                    return t
                        ? "string" == typeof t
                            ? i.call(C(t), this[0])
                            : i.call(this, t.jquery ? t[0] : t)
                        : this[0] && this[0].parentNode
                        ? this.first().prevAll().length
                        : -1
                },
                add: function (t, e) {
                    return this.pushStack(
                        C.unique(C.merge(this.get(), C(t, e)))
                    )
                },
                addBack: function (t) {
                    return this.add(
                        null == t ? this.prevObject : this.prevObject.filter(t)
                    )
                },
            }),
            C.each(
                {
                    parent: function (t) {
                        var e = t.parentNode
                        return e && 11 !== e.nodeType ? e : null
                    },
                    parents: function (t) {
                        return C.dir(t, "parentNode")
                    },
                    parentsUntil: function (t, e, n) {
                        return C.dir(t, "parentNode", n)
                    },
                    next: function (t) {
                        return _(t, "nextSibling")
                    },
                    prev: function (t) {
                        return _(t, "previousSibling")
                    },
                    nextAll: function (t) {
                        return C.dir(t, "nextSibling")
                    },
                    prevAll: function (t) {
                        return C.dir(t, "previousSibling")
                    },
                    nextUntil: function (t, e, n) {
                        return C.dir(t, "nextSibling", n)
                    },
                    prevUntil: function (t, e, n) {
                        return C.dir(t, "previousSibling", n)
                    },
                    siblings: function (t) {
                        return C.sibling((t.parentNode || {}).firstChild, t)
                    },
                    children: function (t) {
                        return C.sibling(t.firstChild)
                    },
                    contents: function (t) {
                        return t.contentDocument || C.merge([], t.childNodes)
                    },
                },
                function (r, i) {
                    C.fn[r] = function (t, e) {
                        var n = C.map(this, i, t)
                        return (
                            "Until" !== r.slice(-5) && (e = t),
                            e && "string" == typeof e && (n = C.filter(e, n)),
                            1 < this.length &&
                                (A[r] || C.unique(n), k.test(r) && n.reverse()),
                            this.pushStack(n)
                        )
                    }
                }
            )
        var $,
            N = /\S+/g,
            D = {}
        function j() {
            y.removeEventListener("DOMContentLoaded", j, !1),
                f.removeEventListener("load", j, !1),
                C.ready()
        }
        ;(C.Callbacks = function (i) {
            var t, n
            i =
                "string" == typeof i
                    ? D[i] ||
                      ((n = D[(t = i)] = {}),
                      C.each(t.match(N) || [], function (t, e) {
                          n[e] = !0
                      }),
                      n)
                    : C.extend({}, i)
            var e,
                r,
                o,
                s,
                a,
                l,
                c = [],
                u = !i.once && [],
                p = function (t) {
                    for (
                        e = i.memory && t,
                            r = !0,
                            l = s || 0,
                            s = 0,
                            a = c.length,
                            o = !0;
                        c && l < a;
                        l++
                    )
                        if (!1 === c[l].apply(t[0], t[1]) && i.stopOnFalse) {
                            e = !1
                            break
                        }
                    ;(o = !1),
                        c &&
                            (u
                                ? u.length && p(u.shift())
                                : e
                                ? (c = [])
                                : h.disable())
                },
                h = {
                    add: function () {
                        var t
                        return (
                            c &&
                                ((t = c.length),
                                (function r(t) {
                                    C.each(t, function (t, e) {
                                        var n = C.type(e)
                                        "function" === n
                                            ? (i.unique && h.has(e)) ||
                                              c.push(e)
                                            : e &&
                                              e.length &&
                                              "string" !== n &&
                                              r(e)
                                    })
                                })(arguments),
                                o ? (a = c.length) : e && ((s = t), p(e))),
                            this
                        )
                    },
                    remove: function () {
                        return (
                            c &&
                                C.each(arguments, function (t, e) {
                                    for (var n; -1 < (n = C.inArray(e, c, n)); )
                                        c.splice(n, 1),
                                            o && (n <= a && a--, n <= l && l--)
                                }),
                            this
                        )
                    },
                    has: function (t) {
                        return t ? -1 < C.inArray(t, c) : !(!c || !c.length)
                    },
                    empty: function () {
                        return (c = []), (a = 0), this
                    },
                    disable: function () {
                        return (c = u = e = void 0), this
                    },
                    disabled: function () {
                        return !c
                    },
                    lock: function () {
                        return (u = void 0), e || h.disable(), this
                    },
                    locked: function () {
                        return !u
                    },
                    fireWith: function (t, e) {
                        return (
                            !c ||
                                (r && !u) ||
                                ((e = [t, (e = e || []).slice ? e.slice() : e]),
                                o ? u.push(e) : p(e)),
                            this
                        )
                    },
                    fire: function () {
                        return h.fireWith(this, arguments), this
                    },
                    fired: function () {
                        return !!r
                    },
                }
            return h
        }),
            C.extend({
                Deferred: function (t) {
                    var o = [
                            [
                                "resolve",
                                "done",
                                C.Callbacks("once memory"),
                                "resolved",
                            ],
                            [
                                "reject",
                                "fail",
                                C.Callbacks("once memory"),
                                "rejected",
                            ],
                            ["notify", "progress", C.Callbacks("memory")],
                        ],
                        i = "pending",
                        s = {
                            state: function () {
                                return i
                            },
                            always: function () {
                                return a.done(arguments).fail(arguments), this
                            },
                            then: function () {
                                var i = arguments
                                return C.Deferred(function (r) {
                                    C.each(o, function (t, e) {
                                        var n = C.isFunction(i[t]) && i[t]
                                        a[e[1]](function () {
                                            var t =
                                                n && n.apply(this, arguments)
                                            t && C.isFunction(t.promise)
                                                ? t
                                                      .promise()
                                                      .done(r.resolve)
                                                      .fail(r.reject)
                                                      .progress(r.notify)
                                                : r[e[0] + "With"](
                                                      this === s
                                                          ? r.promise()
                                                          : this,
                                                      n ? [t] : arguments
                                                  )
                                        })
                                    }),
                                        (i = null)
                                }).promise()
                            },
                            promise: function (t) {
                                return null != t ? C.extend(t, s) : s
                            },
                        },
                        a = {}
                    return (
                        (s.pipe = s.then),
                        C.each(o, function (t, e) {
                            var n = e[2],
                                r = e[3]
                            ;(s[e[1]] = n.add),
                                r &&
                                    n.add(
                                        function () {
                                            i = r
                                        },
                                        o[1 ^ t][2].disable,
                                        o[2][2].lock
                                    ),
                                (a[e[0]] = function () {
                                    return (
                                        a[e[0] + "With"](
                                            this === a ? s : this,
                                            arguments
                                        ),
                                        this
                                    )
                                }),
                                (a[e[0] + "With"] = n.fireWith)
                        }),
                        s.promise(a),
                        t && t.call(a, a),
                        a
                    )
                },
                when: function (t) {
                    function e(e, n, r) {
                        return function (t) {
                            ;(n[e] = this),
                                (r[e] =
                                    1 < arguments.length
                                        ? u.call(arguments)
                                        : t),
                                r === i
                                    ? c.notifyWith(n, r)
                                    : --l || c.resolveWith(n, r)
                        }
                    }
                    var i,
                        n,
                        r,
                        o = 0,
                        s = u.call(arguments),
                        a = s.length,
                        l = 1 !== a || (t && C.isFunction(t.promise)) ? a : 0,
                        c = 1 === l ? t : C.Deferred()
                    if (1 < a)
                        for (
                            i = new Array(a),
                                n = new Array(a),
                                r = new Array(a);
                            o < a;
                            o++
                        )
                            s[o] && C.isFunction(s[o].promise)
                                ? s[o]
                                      .promise()
                                      .done(e(o, r, s))
                                      .fail(c.reject)
                                      .progress(e(o, n, i))
                                : --l
                    return l || c.resolveWith(r, s), c.promise()
                },
            }),
            (C.fn.ready = function (t) {
                return C.ready.promise().done(t), this
            }),
            C.extend({
                isReady: !1,
                readyWait: 1,
                holdReady: function (t) {
                    t ? C.readyWait++ : C.ready(!0)
                },
                ready: function (t) {
                    ;(!0 === t ? --C.readyWait : C.isReady) ||
                        ((C.isReady = !0) !== t && 0 < --C.readyWait) ||
                        ($.resolveWith(y, [C]),
                        C.fn.triggerHandler &&
                            (C(y).triggerHandler("ready"), C(y).off("ready")))
                },
            }),
            (C.ready.promise = function (t) {
                return (
                    $ ||
                        (($ = C.Deferred()),
                        "complete" === y.readyState
                            ? setTimeout(C.ready)
                            : (y.addEventListener("DOMContentLoaded", j, !1),
                              f.addEventListener("load", j, !1))),
                    $.promise(t)
                )
            }),
            C.ready.promise()
        var q = (C.access = function (t, e, n, r, i, o, s) {
            var a = 0,
                l = t.length,
                c = null == n
            if ("object" === C.type(n))
                for (a in ((i = !0), n)) C.access(t, e, a, n[a], !0, o, s)
            else if (
                void 0 !== r &&
                ((i = !0),
                C.isFunction(r) || (s = !0),
                c &&
                    (e = s
                        ? (e.call(t, r), null)
                        : ((c = e),
                          function (t, e, n) {
                              return c.call(C(t), n)
                          })),
                e)
            )
                for (; a < l; a++)
                    e(t[a], n, s ? r : r.call(t[a], a, e(t[a], n)))
            return i ? t : c ? e.call(t) : l ? e(t[0], n) : o
        })
        function I() {
            Object.defineProperty((this.cache = {}), 0, {
                get: function () {
                    return {}
                },
            }),
                (this.expando = C.expando + I.uid++)
        }
        ;(C.acceptData = function (t) {
            return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType
        }),
            (I.uid = 1),
            (I.accepts = C.acceptData),
            (I.prototype = {
                key: function (e) {
                    if (!I.accepts(e)) return 0
                    var n = {},
                        r = e[this.expando]
                    if (!r) {
                        r = I.uid++
                        try {
                            ;(n[this.expando] = { value: r }),
                                Object.defineProperties(e, n)
                        } catch (t) {
                            ;(n[this.expando] = r), C.extend(e, n)
                        }
                    }
                    return this.cache[r] || (this.cache[r] = {}), r
                },
                set: function (t, e, n) {
                    var r,
                        i = this.key(t),
                        o = this.cache[i]
                    if ("string" == typeof e) o[e] = n
                    else if (C.isEmptyObject(o)) C.extend(this.cache[i], e)
                    else for (r in e) o[r] = e[r]
                    return o
                },
                get: function (t, e) {
                    var n = this.cache[this.key(t)]
                    return void 0 === e ? n : n[e]
                },
                access: function (t, e, n) {
                    var r
                    return void 0 === e ||
                        (e && "string" == typeof e && void 0 === n)
                        ? void 0 !== (r = this.get(t, e))
                            ? r
                            : this.get(t, C.camelCase(e))
                        : (this.set(t, e, n), void 0 !== n ? n : e)
                },
                remove: function (t, e) {
                    var n,
                        r,
                        i,
                        o = this.key(t),
                        s = this.cache[o]
                    if (void 0 === e) this.cache[o] = {}
                    else {
                        n = (r = C.isArray(e)
                            ? e.concat(e.map(C.camelCase))
                            : ((i = C.camelCase(e)),
                              e in s
                                  ? [e, i]
                                  : (r = i) in s
                                  ? [r]
                                  : r.match(N) || [])).length
                        for (; n--; ) delete s[r[n]]
                    }
                },
                hasData: function (t) {
                    return !C.isEmptyObject(this.cache[t[this.expando]] || {})
                },
                discard: function (t) {
                    t[this.expando] && delete this.cache[t[this.expando]]
                },
            })
        var O = new I(),
            P = new I(),
            R = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            L = /([A-Z])/g
        function H(t, e, n) {
            var r
            if (void 0 === n && 1 === t.nodeType)
                if (
                    ((r = "data-" + e.replace(L, "-$1").toLowerCase()),
                    "string" == typeof (n = t.getAttribute(r)))
                ) {
                    try {
                        n =
                            "true" === n ||
                            ("false" !== n &&
                                ("null" === n
                                    ? null
                                    : +n + "" === n
                                    ? +n
                                    : R.test(n)
                                    ? C.parseJSON(n)
                                    : n))
                    } catch (t) {}
                    P.set(t, e, n)
                } else n = void 0
            return n
        }
        C.extend({
            hasData: function (t) {
                return P.hasData(t) || O.hasData(t)
            },
            data: function (t, e, n) {
                return P.access(t, e, n)
            },
            removeData: function (t, e) {
                P.remove(t, e)
            },
            _data: function (t, e, n) {
                return O.access(t, e, n)
            },
            _removeData: function (t, e) {
                O.remove(t, e)
            },
        }),
            C.fn.extend({
                data: function (r, t) {
                    var e,
                        n,
                        i,
                        o = this[0],
                        s = o && o.attributes
                    if (void 0 !== r)
                        return "object" == typeof r
                            ? this.each(function () {
                                  P.set(this, r)
                              })
                            : q(
                                  this,
                                  function (e) {
                                      var t,
                                          n = C.camelCase(r)
                                      if (o && void 0 === e) {
                                          if (void 0 !== (t = P.get(o, r)))
                                              return t
                                          if (void 0 !== (t = P.get(o, n)))
                                              return t
                                          if (void 0 !== (t = H(o, n, void 0)))
                                              return t
                                      } else
                                          this.each(function () {
                                              var t = P.get(this, n)
                                              P.set(this, n, e),
                                                  -1 !== r.indexOf("-") &&
                                                      void 0 !== t &&
                                                      P.set(this, r, e)
                                          })
                                  },
                                  null,
                                  t,
                                  1 < arguments.length,
                                  null,
                                  !0
                              )
                    if (
                        this.length &&
                        ((i = P.get(o)),
                        1 === o.nodeType && !O.get(o, "hasDataAttrs"))
                    ) {
                        for (e = s.length; e--; )
                            s[e] &&
                                0 === (n = s[e].name).indexOf("data-") &&
                                ((n = C.camelCase(n.slice(5))), H(o, n, i[n]))
                        O.set(o, "hasDataAttrs", !0)
                    }
                    return i
                },
                removeData: function (t) {
                    return this.each(function () {
                        P.remove(this, t)
                    })
                },
            }),
            C.extend({
                queue: function (t, e, n) {
                    var r
                    return t
                        ? ((e = (e || "fx") + "queue"),
                          (r = O.get(t, e)),
                          n &&
                              (!r || C.isArray(n)
                                  ? (r = O.access(t, e, C.makeArray(n)))
                                  : r.push(n)),
                          r || [])
                        : void 0
                },
                dequeue: function (t, e) {
                    e = e || "fx"
                    var n = C.queue(t, e),
                        r = n.length,
                        i = n.shift(),
                        o = C._queueHooks(t, e)
                    "inprogress" === i && ((i = n.shift()), r--),
                        i &&
                            ("fx" === e && n.unshift("inprogress"),
                            delete o.stop,
                            i.call(
                                t,
                                function () {
                                    C.dequeue(t, e)
                                },
                                o
                            )),
                        !r && o && o.empty.fire()
                },
                _queueHooks: function (t, e) {
                    var n = e + "queueHooks"
                    return (
                        O.get(t, n) ||
                        O.access(t, n, {
                            empty: C.Callbacks("once memory").add(function () {
                                O.remove(t, [e + "queue", n])
                            }),
                        })
                    )
                },
            }),
            C.fn.extend({
                queue: function (e, n) {
                    var t = 2
                    return (
                        "string" != typeof e && ((n = e), (e = "fx"), t--),
                        arguments.length < t
                            ? C.queue(this[0], e)
                            : void 0 === n
                            ? this
                            : this.each(function () {
                                  var t = C.queue(this, e, n)
                                  C._queueHooks(this, e),
                                      "fx" === e &&
                                          "inprogress" !== t[0] &&
                                          C.dequeue(this, e)
                              })
                    )
                },
                dequeue: function (t) {
                    return this.each(function () {
                        C.dequeue(this, t)
                    })
                },
                clearQueue: function (t) {
                    return this.queue(t || "fx", [])
                },
                promise: function (t, e) {
                    function n() {
                        --i || o.resolveWith(s, [s])
                    }
                    var r,
                        i = 1,
                        o = C.Deferred(),
                        s = this,
                        a = this.length
                    for (
                        "string" != typeof t && ((e = t), (t = void 0)),
                            t = t || "fx";
                        a--;

                    )
                        (r = O.get(s[a], t + "queueHooks")) &&
                            r.empty &&
                            (i++, r.empty.add(n))
                    return n(), o.promise(e)
                },
            })
        function F(t, e) {
            return (
                (t = e || t),
                "none" === C.css(t, "display") ||
                    !C.contains(t.ownerDocument, t)
            )
        }
        var Q,
            U,
            B = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            M = ["Top", "Right", "Bottom", "Left"],
            W = /^(?:checkbox|radio)$/i
        ;(Q = y.createDocumentFragment().appendChild(y.createElement("div"))),
            (U = y.createElement("input")).setAttribute("type", "radio"),
            U.setAttribute("checked", "checked"),
            U.setAttribute("name", "t"),
            Q.appendChild(U),
            (v.checkClone = Q.cloneNode(!0).cloneNode(!0).lastChild.checked),
            (Q.innerHTML = "<textarea>x</textarea>"),
            (v.noCloneChecked = !!Q.cloneNode(!0).lastChild.defaultValue)
        var z = "undefined"
        v.focusinBubbles = "onfocusin" in f
        var V = /^key/,
            X = /^(?:mouse|pointer|contextmenu)|click/,
            G = /^(?:focusinfocus|focusoutblur)$/,
            Y = /^([^.]*)(?:\.(.+)|)$/
        function J() {
            return !0
        }
        function Z() {
            return !1
        }
        function K() {
            try {
                return y.activeElement
            } catch (t) {}
        }
        ;(C.event = {
            global: {},
            add: function (e, t, n, r, i) {
                var o,
                    s,
                    a,
                    l,
                    c,
                    u,
                    p,
                    h,
                    d,
                    f,
                    g,
                    m = O.get(e)
                if (m)
                    for (
                        n.handler && ((n = (o = n).handler), (i = o.selector)),
                            n.guid || (n.guid = C.guid++),
                            (l = m.events) || (l = m.events = {}),
                            (s = m.handle) ||
                                (s = m.handle =
                                    function (t) {
                                        return typeof C != z &&
                                            C.event.triggered !== t.type
                                            ? C.event.dispatch.apply(
                                                  e,
                                                  arguments
                                              )
                                            : void 0
                                    }),
                            c = (t = (t || "").match(N) || [""]).length;
                        c--;

                    )
                        (d = g = (a = Y.exec(t[c]) || [])[1]),
                            (f = (a[2] || "").split(".").sort()),
                            d &&
                                ((p = C.event.special[d] || {}),
                                (d = (i ? p.delegateType : p.bindType) || d),
                                (p = C.event.special[d] || {}),
                                (u = C.extend(
                                    {
                                        type: d,
                                        origType: g,
                                        data: r,
                                        handler: n,
                                        guid: n.guid,
                                        selector: i,
                                        needsContext:
                                            i &&
                                            C.expr.match.needsContext.test(i),
                                        namespace: f.join("."),
                                    },
                                    o
                                )),
                                (h = l[d]) ||
                                    (((h = l[d] = []).delegateCount = 0),
                                    (p.setup &&
                                        !1 !== p.setup.call(e, r, f, s)) ||
                                        (e.addEventListener &&
                                            e.addEventListener(d, s, !1))),
                                p.add &&
                                    (p.add.call(e, u),
                                    u.handler.guid ||
                                        (u.handler.guid = n.guid)),
                                i
                                    ? h.splice(h.delegateCount++, 0, u)
                                    : h.push(u),
                                (C.event.global[d] = !0))
            },
            remove: function (t, e, n, r, i) {
                var o,
                    s,
                    a,
                    l,
                    c,
                    u,
                    p,
                    h,
                    d,
                    f,
                    g,
                    m = O.hasData(t) && O.get(t)
                if (m && (l = m.events)) {
                    for (c = (e = (e || "").match(N) || [""]).length; c--; )
                        if (
                            ((d = g = (a = Y.exec(e[c]) || [])[1]),
                            (f = (a[2] || "").split(".").sort()),
                            d)
                        ) {
                            for (
                                p = C.event.special[d] || {},
                                    h =
                                        l[
                                            (d =
                                                (r
                                                    ? p.delegateType
                                                    : p.bindType) || d)
                                        ] || [],
                                    a =
                                        a[2] &&
                                        new RegExp(
                                            "(^|\\.)" +
                                                f.join("\\.(?:.*\\.|)") +
                                                "(\\.|$)"
                                        ),
                                    s = o = h.length;
                                o--;

                            )
                                (u = h[o]),
                                    (!i && g !== u.origType) ||
                                        (n && n.guid !== u.guid) ||
                                        (a && !a.test(u.namespace)) ||
                                        (r &&
                                            r !== u.selector &&
                                            ("**" !== r || !u.selector)) ||
                                        (h.splice(o, 1),
                                        u.selector && h.delegateCount--,
                                        p.remove && p.remove.call(t, u))
                            s &&
                                !h.length &&
                                ((p.teardown &&
                                    !1 !== p.teardown.call(t, f, m.handle)) ||
                                    C.removeEvent(t, d, m.handle),
                                delete l[d])
                        } else
                            for (d in l) C.event.remove(t, d + e[c], n, r, !0)
                    C.isEmptyObject(l) &&
                        (delete m.handle, O.remove(t, "events"))
                }
            },
            trigger: function (t, e, n, r) {
                var i,
                    o,
                    s,
                    a,
                    l,
                    c,
                    u = [n || y],
                    p = m.call(t, "type") ? t.type : t,
                    h = m.call(t, "namespace") ? t.namespace.split(".") : [],
                    d = (o = n = n || y)
                if (
                    3 !== n.nodeType &&
                    8 !== n.nodeType &&
                    !G.test(p + C.event.triggered) &&
                    (0 <= p.indexOf(".") &&
                        ((p = (h = p.split(".")).shift()), h.sort()),
                    (a = p.indexOf(":") < 0 && "on" + p),
                    ((t = t[C.expando]
                        ? t
                        : new C.Event(p, "object" == typeof t && t)).isTrigger =
                        r ? 2 : 3),
                    (t.namespace = h.join(".")),
                    (t.namespace_re = t.namespace
                        ? new RegExp(
                              "(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"
                          )
                        : null),
                    (t.result = void 0),
                    t.target || (t.target = n),
                    (e = null == e ? [t] : C.makeArray(e, [t])),
                    (c = C.event.special[p] || {}),
                    r || !c.trigger || !1 !== c.trigger.apply(n, e))
                ) {
                    if (!r && !c.noBubble && !C.isWindow(n)) {
                        for (
                            s = c.delegateType || p,
                                G.test(s + p) || (d = d.parentNode);
                            d;
                            d = d.parentNode
                        )
                            u.push(d), (o = d)
                        o === (n.ownerDocument || y) &&
                            u.push(o.defaultView || o.parentWindow || f)
                    }
                    for (i = 0; (d = u[i++]) && !t.isPropagationStopped(); )
                        (t.type = 1 < i ? s : c.bindType || p),
                            (l =
                                (O.get(d, "events") || {})[t.type] &&
                                O.get(d, "handle")) && l.apply(d, e),
                            (l = a && d[a]) &&
                                l.apply &&
                                C.acceptData(d) &&
                                ((t.result = l.apply(d, e)),
                                !1 === t.result && t.preventDefault())
                    return (
                        (t.type = p),
                        r ||
                            t.isDefaultPrevented() ||
                            (c._default &&
                                !1 !== c._default.apply(u.pop(), e)) ||
                            !C.acceptData(n) ||
                            (a &&
                                C.isFunction(n[p]) &&
                                !C.isWindow(n) &&
                                ((o = n[a]) && (n[a] = null),
                                n[(C.event.triggered = p)](),
                                (C.event.triggered = void 0),
                                o && (n[a] = o))),
                        t.result
                    )
                }
            },
            dispatch: function (t) {
                t = C.event.fix(t)
                var e,
                    n,
                    r,
                    i,
                    o,
                    s,
                    a = u.call(arguments),
                    l = (O.get(this, "events") || {})[t.type] || [],
                    c = C.event.special[t.type] || {}
                if (
                    (((a[0] = t).delegateTarget = this),
                    !c.preDispatch || !1 !== c.preDispatch.call(this, t))
                ) {
                    for (
                        s = C.event.handlers.call(this, t, l), e = 0;
                        (i = s[e++]) && !t.isPropagationStopped();

                    )
                        for (
                            t.currentTarget = i.elem, n = 0;
                            (o = i.handlers[n++]) &&
                            !t.isImmediatePropagationStopped();

                        )
                            (t.namespace_re &&
                                !t.namespace_re.test(o.namespace)) ||
                                ((t.handleObj = o),
                                (t.data = o.data),
                                void 0 !==
                                    (r = (
                                        (C.event.special[o.origType] || {})
                                            .handle || o.handler
                                    ).apply(i.elem, a)) &&
                                    !1 === (t.result = r) &&
                                    (t.preventDefault(), t.stopPropagation()))
                    return (
                        c.postDispatch && c.postDispatch.call(this, t), t.result
                    )
                }
            },
            handlers: function (t, e) {
                var n,
                    r,
                    i,
                    o,
                    s = [],
                    a = e.delegateCount,
                    l = t.target
                if (a && l.nodeType && (!t.button || "click" !== t.type))
                    for (; l !== this; l = l.parentNode || this)
                        if (!0 !== l.disabled || "click" !== t.type) {
                            for (r = [], n = 0; n < a; n++)
                                void 0 === r[(i = (o = e[n]).selector + " ")] &&
                                    (r[i] = o.needsContext
                                        ? 0 <= C(i, this).index(l)
                                        : C.find(i, this, null, [l]).length),
                                    r[i] && r.push(o)
                            r.length && s.push({ elem: l, handlers: r })
                        }
                return (
                    a < e.length &&
                        s.push({ elem: this, handlers: e.slice(a) }),
                    s
                )
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
                " "
            ),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function (t, e) {
                    return (
                        null == t.which &&
                            (t.which =
                                null != e.charCode ? e.charCode : e.keyCode),
                        t
                    )
                },
            },
            mouseHooks: {
                props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(
                    " "
                ),
                filter: function (t, e) {
                    var n,
                        r,
                        i,
                        o = e.button
                    return (
                        null == t.pageX &&
                            null != e.clientX &&
                            ((r = (n = t.target.ownerDocument || y)
                                .documentElement),
                            (i = n.body),
                            (t.pageX =
                                e.clientX +
                                ((r && r.scrollLeft) ||
                                    (i && i.scrollLeft) ||
                                    0) -
                                ((r && r.clientLeft) ||
                                    (i && i.clientLeft) ||
                                    0)),
                            (t.pageY =
                                e.clientY +
                                ((r && r.scrollTop) ||
                                    (i && i.scrollTop) ||
                                    0) -
                                ((r && r.clientTop) ||
                                    (i && i.clientTop) ||
                                    0))),
                        t.which ||
                            void 0 === o ||
                            (t.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                        t
                    )
                },
            },
            fix: function (t) {
                if (t[C.expando]) return t
                var e,
                    n,
                    r,
                    i = t.type,
                    o = t,
                    s = this.fixHooks[i]
                for (
                    s ||
                        (this.fixHooks[i] = s =
                            X.test(i)
                                ? this.mouseHooks
                                : V.test(i)
                                ? this.keyHooks
                                : {}),
                        r = s.props ? this.props.concat(s.props) : this.props,
                        t = new C.Event(o),
                        e = r.length;
                    e--;

                )
                    t[(n = r[e])] = o[n]
                return (
                    t.target || (t.target = y),
                    3 === t.target.nodeType && (t.target = t.target.parentNode),
                    s.filter ? s.filter(t, o) : t
                )
            },
            special: {
                load: { noBubble: !0 },
                focus: {
                    trigger: function () {
                        return this !== K() && this.focus
                            ? (this.focus(), !1)
                            : void 0
                    },
                    delegateType: "focusin",
                },
                blur: {
                    trigger: function () {
                        return this === K() && this.blur
                            ? (this.blur(), !1)
                            : void 0
                    },
                    delegateType: "focusout",
                },
                click: {
                    trigger: function () {
                        return "checkbox" === this.type &&
                            this.click &&
                            C.nodeName(this, "input")
                            ? (this.click(), !1)
                            : void 0
                    },
                    _default: function (t) {
                        return C.nodeName(t.target, "a")
                    },
                },
                beforeunload: {
                    postDispatch: function (t) {
                        void 0 !== t.result &&
                            t.originalEvent &&
                            (t.originalEvent.returnValue = t.result)
                    },
                },
            },
            simulate: function (t, e, n, r) {
                var i = C.extend(new C.Event(), n, {
                    type: t,
                    isSimulated: !0,
                    originalEvent: {},
                })
                r ? C.event.trigger(i, null, e) : C.event.dispatch.call(e, i),
                    i.isDefaultPrevented() && n.preventDefault()
            },
        }),
            (C.removeEvent = function (t, e, n) {
                t.removeEventListener && t.removeEventListener(e, n, !1)
            }),
            (C.Event = function (t, e) {
                return this instanceof C.Event
                    ? (t && t.type
                          ? ((this.originalEvent = t),
                            (this.type = t.type),
                            (this.isDefaultPrevented =
                                t.defaultPrevented ||
                                (void 0 === t.defaultPrevented &&
                                    !1 === t.returnValue)
                                    ? J
                                    : Z))
                          : (this.type = t),
                      e && C.extend(this, e),
                      (this.timeStamp = (t && t.timeStamp) || C.now()),
                      void (this[C.expando] = !0))
                    : new C.Event(t, e)
            }),
            (C.Event.prototype = {
                isDefaultPrevented: Z,
                isPropagationStopped: Z,
                isImmediatePropagationStopped: Z,
                preventDefault: function () {
                    var t = this.originalEvent
                    ;(this.isDefaultPrevented = J),
                        t && t.preventDefault && t.preventDefault()
                },
                stopPropagation: function () {
                    var t = this.originalEvent
                    ;(this.isPropagationStopped = J),
                        t && t.stopPropagation && t.stopPropagation()
                },
                stopImmediatePropagation: function () {
                    var t = this.originalEvent
                    ;(this.isImmediatePropagationStopped = J),
                        t &&
                            t.stopImmediatePropagation &&
                            t.stopImmediatePropagation(),
                        this.stopPropagation()
                },
            }),
            C.each(
                {
                    mouseenter: "mouseover",
                    mouseleave: "mouseout",
                    pointerenter: "pointerover",
                    pointerleave: "pointerout",
                },
                function (t, i) {
                    C.event.special[t] = {
                        delegateType: i,
                        bindType: i,
                        handle: function (t) {
                            var e,
                                n = t.relatedTarget,
                                r = t.handleObj
                            return (
                                (n && (n === this || C.contains(this, n))) ||
                                    ((t.type = r.origType),
                                    (e = r.handler.apply(this, arguments)),
                                    (t.type = i)),
                                e
                            )
                        },
                    }
                }
            ),
            v.focusinBubbles ||
                C.each({ focus: "focusin", blur: "focusout" }, function (n, r) {
                    function i(t) {
                        C.event.simulate(r, t.target, C.event.fix(t), !0)
                    }
                    C.event.special[r] = {
                        setup: function () {
                            var t = this.ownerDocument || this,
                                e = O.access(t, r)
                            e || t.addEventListener(n, i, !0),
                                O.access(t, r, (e || 0) + 1)
                        },
                        teardown: function () {
                            var t = this.ownerDocument || this,
                                e = O.access(t, r) - 1
                            e
                                ? O.access(t, r, e)
                                : (t.removeEventListener(n, i, !0),
                                  O.remove(t, r))
                        },
                    }
                }),
            C.fn.extend({
                on: function (t, e, n, r, i) {
                    var o, s
                    if ("object" == typeof t) {
                        for (s in ("string" != typeof e &&
                            ((n = n || e), (e = void 0)),
                        t))
                            this.on(s, e, n, t[s], i)
                        return this
                    }
                    if (
                        (null == n && null == r
                            ? ((r = e), (n = e = void 0))
                            : null == r &&
                              ("string" == typeof e
                                  ? ((r = n), (n = void 0))
                                  : ((r = n), (n = e), (e = void 0))),
                        !1 === r)
                    )
                        r = Z
                    else if (!r) return this
                    return (
                        1 === i &&
                            ((o = r),
                            ((r = function (t) {
                                return C().off(t), o.apply(this, arguments)
                            }).guid = o.guid || (o.guid = C.guid++))),
                        this.each(function () {
                            C.event.add(this, t, r, n, e)
                        })
                    )
                },
                one: function (t, e, n, r) {
                    return this.on(t, e, n, r, 1)
                },
                off: function (t, e, n) {
                    var r, i
                    if (t && t.preventDefault && t.handleObj)
                        return (
                            (r = t.handleObj),
                            C(t.delegateTarget).off(
                                r.namespace
                                    ? r.origType + "." + r.namespace
                                    : r.origType,
                                r.selector,
                                r.handler
                            ),
                            this
                        )
                    if ("object" != typeof t)
                        return (
                            (!1 !== e && "function" != typeof e) ||
                                ((n = e), (e = void 0)),
                            !1 === n && (n = Z),
                            this.each(function () {
                                C.event.remove(this, t, n, e)
                            })
                        )
                    for (i in t) this.off(i, e, t[i])
                    return this
                },
                trigger: function (t, e) {
                    return this.each(function () {
                        C.event.trigger(t, e, this)
                    })
                },
                triggerHandler: function (t, e) {
                    var n = this[0]
                    return n ? C.event.trigger(t, e, n, !0) : void 0
                },
            })
        var tt =
                /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            et = /<([\w:]+)/,
            nt = /<|&#?\w+;/,
            rt = /<(?:script|style|link)/i,
            it = /checked\s*(?:[^=]|=\s*.checked.)/i,
            ot = /^$|\/(?:java|ecma)script/i,
            st = /^true\/(.*)/,
            at = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            lt = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""],
            }
        function ct(t, e) {
            return C.nodeName(t, "table") &&
                C.nodeName(11 !== e.nodeType ? e : e.firstChild, "tr")
                ? t.getElementsByTagName("tbody")[0] ||
                      t.appendChild(t.ownerDocument.createElement("tbody"))
                : t
        }
        function ut(t) {
            return (
                (t.type = (null !== t.getAttribute("type")) + "/" + t.type), t
            )
        }
        function pt(t) {
            var e = st.exec(t.type)
            return e ? (t.type = e[1]) : t.removeAttribute("type"), t
        }
        function ht(t, e) {
            for (var n = 0, r = t.length; n < r; n++)
                O.set(t[n], "globalEval", !e || O.get(e[n], "globalEval"))
        }
        function dt(t, e) {
            var n, r, i, o, s, a, l, c
            if (1 === e.nodeType) {
                if (
                    O.hasData(t) &&
                    ((o = O.access(t)), (s = O.set(e, o)), (c = o.events))
                )
                    for (i in (delete s.handle, (s.events = {}), c))
                        for (n = 0, r = c[i].length; n < r; n++)
                            C.event.add(e, i, c[i][n])
                P.hasData(t) &&
                    ((a = P.access(t)), (l = C.extend({}, a)), P.set(e, l))
            }
        }
        function ft(t, e) {
            var n = t.getElementsByTagName
                ? t.getElementsByTagName(e || "*")
                : t.querySelectorAll
                ? t.querySelectorAll(e || "*")
                : []
            return void 0 === e || (e && C.nodeName(t, e)) ? C.merge([t], n) : n
        }
        ;(lt.optgroup = lt.option),
            (lt.tbody = lt.tfoot = lt.colgroup = lt.caption = lt.thead),
            (lt.th = lt.td),
            C.extend({
                clone: function (t, e, n) {
                    var r,
                        i,
                        o,
                        s,
                        a,
                        l,
                        c,
                        u = t.cloneNode(!0),
                        p = C.contains(t.ownerDocument, t)
                    if (
                        !(
                            v.noCloneChecked ||
                            (1 !== t.nodeType && 11 !== t.nodeType) ||
                            C.isXMLDoc(t)
                        )
                    )
                        for (
                            s = ft(u), r = 0, i = (o = ft(t)).length;
                            r < i;
                            r++
                        )
                            (a = o[r]),
                                (l = s[r]),
                                (c = void 0),
                                "input" === (c = l.nodeName.toLowerCase()) &&
                                W.test(a.type)
                                    ? (l.checked = a.checked)
                                    : ("input" !== c && "textarea" !== c) ||
                                      (l.defaultValue = a.defaultValue)
                    if (e)
                        if (n)
                            for (
                                o = o || ft(t),
                                    s = s || ft(u),
                                    r = 0,
                                    i = o.length;
                                r < i;
                                r++
                            )
                                dt(o[r], s[r])
                        else dt(t, u)
                    return (
                        0 < (s = ft(u, "script")).length &&
                            ht(s, !p && ft(t, "script")),
                        u
                    )
                },
                buildFragment: function (t, e, n, r) {
                    for (
                        var i,
                            o,
                            s,
                            a,
                            l,
                            c,
                            u = e.createDocumentFragment(),
                            p = [],
                            h = 0,
                            d = t.length;
                        h < d;
                        h++
                    )
                        if ((i = t[h]) || 0 === i)
                            if ("object" === C.type(i))
                                C.merge(p, i.nodeType ? [i] : i)
                            else if (nt.test(i)) {
                                for (
                                    o =
                                        o ||
                                        u.appendChild(e.createElement("div")),
                                        s = (et.exec(i) || [
                                            "",
                                            "",
                                        ])[1].toLowerCase(),
                                        a = lt[s] || lt._default,
                                        o.innerHTML =
                                            a[1] +
                                            i.replace(tt, "<$1></$2>") +
                                            a[2],
                                        c = a[0];
                                    c--;

                                )
                                    o = o.lastChild
                                C.merge(p, o.childNodes),
                                    ((o = u.firstChild).textContent = "")
                            } else p.push(e.createTextNode(i))
                    for (u.textContent = "", h = 0; (i = p[h++]); )
                        if (
                            (!r || -1 === C.inArray(i, r)) &&
                            ((l = C.contains(i.ownerDocument, i)),
                            (o = ft(u.appendChild(i), "script")),
                            l && ht(o),
                            n)
                        )
                            for (c = 0; (i = o[c++]); )
                                ot.test(i.type || "") && n.push(i)
                    return u
                },
                cleanData: function (t) {
                    for (
                        var e, n, r, i, o = C.event.special, s = 0;
                        void 0 !== (n = t[s]);
                        s++
                    ) {
                        if (
                            C.acceptData(n) &&
                            (i = n[O.expando]) &&
                            (e = O.cache[i])
                        ) {
                            if (e.events)
                                for (r in e.events)
                                    o[r]
                                        ? C.event.remove(n, r)
                                        : C.removeEvent(n, r, e.handle)
                            O.cache[i] && delete O.cache[i]
                        }
                        delete P.cache[n[P.expando]]
                    }
                },
            }),
            C.fn.extend({
                text: function (t) {
                    return q(
                        this,
                        function (t) {
                            return void 0 === t
                                ? C.text(this)
                                : this.empty().each(function () {
                                      ;(1 !== this.nodeType &&
                                          11 !== this.nodeType &&
                                          9 !== this.nodeType) ||
                                          (this.textContent = t)
                                  })
                        },
                        null,
                        t,
                        arguments.length
                    )
                },
                append: function () {
                    return this.domManip(arguments, function (t) {
                        ;(1 !== this.nodeType &&
                            11 !== this.nodeType &&
                            9 !== this.nodeType) ||
                            ct(this, t).appendChild(t)
                    })
                },
                prepend: function () {
                    return this.domManip(arguments, function (t) {
                        var e
                        ;(1 !== this.nodeType &&
                            11 !== this.nodeType &&
                            9 !== this.nodeType) ||
                            (e = ct(this, t)).insertBefore(t, e.firstChild)
                    })
                },
                before: function () {
                    return this.domManip(arguments, function (t) {
                        this.parentNode && this.parentNode.insertBefore(t, this)
                    })
                },
                after: function () {
                    return this.domManip(arguments, function (t) {
                        this.parentNode &&
                            this.parentNode.insertBefore(t, this.nextSibling)
                    })
                },
                remove: function (t, e) {
                    for (
                        var n, r = t ? C.filter(t, this) : this, i = 0;
                        null != (n = r[i]);
                        i++
                    )
                        e || 1 !== n.nodeType || C.cleanData(ft(n)),
                            n.parentNode &&
                                (e &&
                                    C.contains(n.ownerDocument, n) &&
                                    ht(ft(n, "script")),
                                n.parentNode.removeChild(n))
                    return this
                },
                empty: function () {
                    for (var t, e = 0; null != (t = this[e]); e++)
                        1 === t.nodeType &&
                            (C.cleanData(ft(t, !1)), (t.textContent = ""))
                    return this
                },
                clone: function (t, e) {
                    return (
                        (t = null != t && t),
                        (e = null == e ? t : e),
                        this.map(function () {
                            return C.clone(this, t, e)
                        })
                    )
                },
                html: function (t) {
                    return q(
                        this,
                        function (t) {
                            var e = this[0] || {},
                                n = 0,
                                r = this.length
                            if (void 0 === t && 1 === e.nodeType)
                                return e.innerHTML
                            if (
                                "string" == typeof t &&
                                !rt.test(t) &&
                                !lt[(et.exec(t) || ["", ""])[1].toLowerCase()]
                            ) {
                                t = t.replace(tt, "<$1></$2>")
                                try {
                                    for (; n < r; n++)
                                        1 === (e = this[n] || {}).nodeType &&
                                            (C.cleanData(ft(e, !1)),
                                            (e.innerHTML = t))
                                    e = 0
                                } catch (t) {}
                            }
                            e && this.empty().append(t)
                        },
                        null,
                        t,
                        arguments.length
                    )
                },
                replaceWith: function () {
                    var e = arguments[0]
                    return (
                        this.domManip(arguments, function (t) {
                            ;(e = this.parentNode),
                                C.cleanData(ft(this)),
                                e && e.replaceChild(t, this)
                        }),
                        e && (e.length || e.nodeType) ? this : this.remove()
                    )
                },
                detach: function (t) {
                    return this.remove(t, !0)
                },
                domManip: function (n, r) {
                    n = g.apply([], n)
                    var t,
                        e,
                        i,
                        o,
                        s,
                        a,
                        l = 0,
                        c = this.length,
                        u = this,
                        p = c - 1,
                        h = n[0],
                        d = C.isFunction(h)
                    if (
                        d ||
                        (1 < c &&
                            "string" == typeof h &&
                            !v.checkClone &&
                            it.test(h))
                    )
                        return this.each(function (t) {
                            var e = u.eq(t)
                            d && (n[0] = h.call(this, t, e.html())),
                                e.domManip(n, r)
                        })
                    if (
                        c &&
                        ((e = (t = C.buildFragment(
                            n,
                            this[0].ownerDocument,
                            !1,
                            this
                        )).firstChild),
                        1 === t.childNodes.length && (t = e),
                        e)
                    ) {
                        for (
                            o = (i = C.map(ft(t, "script"), ut)).length;
                            l < c;
                            l++
                        )
                            (s = t),
                                l !== p &&
                                    ((s = C.clone(s, !0, !0)),
                                    o && C.merge(i, ft(s, "script"))),
                                r.call(this[l], s, l)
                        if (o)
                            for (
                                a = i[i.length - 1].ownerDocument,
                                    C.map(i, pt),
                                    l = 0;
                                l < o;
                                l++
                            )
                                (s = i[l]),
                                    ot.test(s.type || "") &&
                                        !O.access(s, "globalEval") &&
                                        C.contains(a, s) &&
                                        (s.src
                                            ? C._evalUrl && C._evalUrl(s.src)
                                            : C.globalEval(
                                                  s.textContent.replace(at, "")
                                              ))
                    }
                    return this
                },
            }),
            C.each(
                {
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith",
                },
                function (t, s) {
                    C.fn[t] = function (t) {
                        for (
                            var e, n = [], r = C(t), i = r.length - 1, o = 0;
                            o <= i;
                            o++
                        )
                            (e = o === i ? this : this.clone(!0)),
                                C(r[o])[s](e),
                                a.apply(n, e.get())
                        return this.pushStack(n)
                    }
                }
            )
        var gt,
            mt = {}
        function vt(t, e) {
            var n,
                r = C(e.createElement(t)).appendTo(e.body),
                i =
                    f.getDefaultComputedStyle &&
                    (n = f.getDefaultComputedStyle(r[0]))
                        ? n.display
                        : C.css(r[0], "display")
            return r.detach(), i
        }
        function yt(t) {
            var e = y,
                n = mt[t]
            return (
                n ||
                    (("none" !== (n = vt(t, e)) && n) ||
                        ((e = (gt = (
                            gt ||
                            C("<iframe frameborder='0' width='0' height='0'/>")
                        ).appendTo(e.documentElement))[0]
                            .contentDocument).write(),
                        e.close(),
                        (n = vt(t, e)),
                        gt.detach()),
                    (mt[t] = n)),
                n
            )
        }
        var bt,
            wt,
            xt,
            Tt,
            Ct,
            St = /^margin/,
            Et = new RegExp("^(" + B + ")(?!px)[a-z%]+$", "i"),
            kt = function (t) {
                return t.ownerDocument.defaultView.opener
                    ? t.ownerDocument.defaultView.getComputedStyle(t, null)
                    : f.getComputedStyle(t, null)
            }
        function At(t, e, n) {
            var r,
                i,
                o,
                s,
                a = t.style
            return (
                (n = n || kt(t)) && (s = n.getPropertyValue(e) || n[e]),
                n &&
                    ("" !== s ||
                        C.contains(t.ownerDocument, t) ||
                        (s = C.style(t, e)),
                    Et.test(s) &&
                        St.test(e) &&
                        ((r = a.width),
                        (i = a.minWidth),
                        (o = a.maxWidth),
                        (a.minWidth = a.maxWidth = a.width = s),
                        (s = n.width),
                        (a.width = r),
                        (a.minWidth = i),
                        (a.maxWidth = o))),
                void 0 !== s ? s + "" : s
            )
        }
        function _t(t, e) {
            return {
                get: function () {
                    return t()
                        ? void delete this.get
                        : (this.get = e).apply(this, arguments)
                },
            }
        }
        function $t() {
            ;(Ct.style.cssText =
                "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute"),
                (Ct.innerHTML = ""),
                xt.appendChild(Tt)
            var t = f.getComputedStyle(Ct, null)
            ;(bt = "1%" !== t.top), (wt = "4px" === t.width), xt.removeChild(Tt)
        }
        ;(xt = y.documentElement),
            (Tt = y.createElement("div")),
            (Ct = y.createElement("div")).style &&
                ((Ct.style.backgroundClip = "content-box"),
                (Ct.cloneNode(!0).style.backgroundClip = ""),
                (v.clearCloneStyle = "content-box" === Ct.style.backgroundClip),
                (Tt.style.cssText =
                    "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute"),
                Tt.appendChild(Ct),
                f.getComputedStyle &&
                    C.extend(v, {
                        pixelPosition: function () {
                            return $t(), bt
                        },
                        boxSizingReliable: function () {
                            return null == wt && $t(), wt
                        },
                        reliableMarginRight: function () {
                            var t,
                                e = Ct.appendChild(y.createElement("div"))
                            return (
                                (e.style.cssText = Ct.style.cssText =
                                    "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0"),
                                (e.style.marginRight = e.style.width = "0"),
                                (Ct.style.width = "1px"),
                                xt.appendChild(Tt),
                                (t = !parseFloat(
                                    f.getComputedStyle(e, null).marginRight
                                )),
                                xt.removeChild(Tt),
                                Ct.removeChild(e),
                                t
                            )
                        },
                    })),
            (C.swap = function (t, e, n, r) {
                var i,
                    o,
                    s = {}
                for (o in e) (s[o] = t.style[o]), (t.style[o] = e[o])
                for (o in ((i = n.apply(t, r || [])), e)) t.style[o] = s[o]
                return i
            })
        var Nt = /^(none|table(?!-c[ea]).+)/,
            Dt = new RegExp("^(" + B + ")(.*)$", "i"),
            jt = new RegExp("^([+-])=(" + B + ")", "i"),
            qt = {
                position: "absolute",
                visibility: "hidden",
                display: "block",
            },
            It = { letterSpacing: "0", fontWeight: "400" },
            Ot = ["Webkit", "O", "Moz", "ms"]
        function Pt(t, e) {
            if (e in t) return e
            for (
                var n = e[0].toUpperCase() + e.slice(1), r = e, i = Ot.length;
                i--;

            )
                if ((e = Ot[i] + n) in t) return e
            return r
        }
        function Rt(t, e, n) {
            var r = Dt.exec(e)
            return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : e
        }
        function Lt(t, e, n, r, i) {
            for (
                var o =
                        n === (r ? "border" : "content")
                            ? 4
                            : "width" === e
                            ? 1
                            : 0,
                    s = 0;
                o < 4;
                o += 2
            )
                "margin" === n && (s += C.css(t, n + M[o], !0, i)),
                    r
                        ? ("content" === n &&
                              (s -= C.css(t, "padding" + M[o], !0, i)),
                          "margin" !== n &&
                              (s -= C.css(t, "border" + M[o] + "Width", !0, i)))
                        : ((s += C.css(t, "padding" + M[o], !0, i)),
                          "padding" !== n &&
                              (s += C.css(t, "border" + M[o] + "Width", !0, i)))
            return s
        }
        function Ht(t, e, n) {
            var r = !0,
                i = "width" === e ? t.offsetWidth : t.offsetHeight,
                o = kt(t),
                s = "border-box" === C.css(t, "boxSizing", !1, o)
            if (i <= 0 || null == i) {
                if (
                    (((i = At(t, e, o)) < 0 || null == i) && (i = t.style[e]),
                    Et.test(i))
                )
                    return i
                ;(r = s && (v.boxSizingReliable() || i === t.style[e])),
                    (i = parseFloat(i) || 0)
            }
            return i + Lt(t, e, n || (s ? "border" : "content"), r, o) + "px"
        }
        function Ft(t, e) {
            for (var n, r, i, o = [], s = 0, a = t.length; s < a; s++)
                (r = t[s]).style &&
                    ((o[s] = O.get(r, "olddisplay")),
                    (n = r.style.display),
                    e
                        ? (o[s] || "none" !== n || (r.style.display = ""),
                          "" === r.style.display &&
                              F(r) &&
                              (o[s] = O.access(
                                  r,
                                  "olddisplay",
                                  yt(r.nodeName)
                              )))
                        : ((i = F(r)),
                          ("none" === n && i) ||
                              O.set(
                                  r,
                                  "olddisplay",
                                  i ? n : C.css(r, "display")
                              )))
            for (s = 0; s < a; s++)
                (r = t[s]).style &&
                    ((e &&
                        "none" !== r.style.display &&
                        "" !== r.style.display) ||
                        (r.style.display = e ? o[s] || "" : "none"))
            return t
        }
        function Qt(t, e, n, r, i) {
            return new Qt.prototype.init(t, e, n, r, i)
        }
        C.extend({
            cssHooks: {
                opacity: {
                    get: function (t, e) {
                        if (e) {
                            var n = At(t, "opacity")
                            return "" === n ? "1" : n
                        }
                    },
                },
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0,
            },
            cssProps: { float: "cssFloat" },
            style: function (t, e, n, r) {
                if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                    var i,
                        o,
                        s,
                        a = C.camelCase(e),
                        l = t.style
                    return (
                        (e = C.cssProps[a] || (C.cssProps[a] = Pt(l, a))),
                        (s = C.cssHooks[e] || C.cssHooks[a]),
                        void 0 === n
                            ? s &&
                              "get" in s &&
                              void 0 !== (i = s.get(t, !1, r))
                                ? i
                                : l[e]
                            : ("string" === (o = typeof n) &&
                                  (i = jt.exec(n)) &&
                                  ((n =
                                      (i[1] + 1) * i[2] +
                                      parseFloat(C.css(t, e))),
                                  (o = "number")),
                              void (
                                  null != n &&
                                  n == n &&
                                  ("number" !== o ||
                                      C.cssNumber[a] ||
                                      (n += "px"),
                                  v.clearCloneStyle ||
                                      "" !== n ||
                                      0 !== e.indexOf("background") ||
                                      (l[e] = "inherit"),
                                  (s &&
                                      "set" in s &&
                                      void 0 === (n = s.set(t, n, r))) ||
                                      (l[e] = n))
                              ))
                    )
                }
            },
            css: function (t, e, n, r) {
                var i,
                    o,
                    s,
                    a = C.camelCase(e)
                return (
                    (e = C.cssProps[a] || (C.cssProps[a] = Pt(t.style, a))),
                    (s = C.cssHooks[e] || C.cssHooks[a]) &&
                        "get" in s &&
                        (i = s.get(t, !0, n)),
                    void 0 === i && (i = At(t, e, r)),
                    "normal" === i && e in It && (i = It[e]),
                    "" === n || n
                        ? ((o = parseFloat(i)),
                          !0 === n || C.isNumeric(o) ? o || 0 : i)
                        : i
                )
            },
        }),
            C.each(["height", "width"], function (t, i) {
                C.cssHooks[i] = {
                    get: function (t, e, n) {
                        return e
                            ? Nt.test(C.css(t, "display")) &&
                              0 === t.offsetWidth
                                ? C.swap(t, qt, function () {
                                      return Ht(t, i, n)
                                  })
                                : Ht(t, i, n)
                            : void 0
                    },
                    set: function (t, e, n) {
                        var r = n && kt(t)
                        return Rt(
                            0,
                            e,
                            n
                                ? Lt(
                                      t,
                                      i,
                                      n,
                                      "border-box" ===
                                          C.css(t, "boxSizing", !1, r),
                                      r
                                  )
                                : 0
                        )
                    },
                }
            }),
            (C.cssHooks.marginRight = _t(
                v.reliableMarginRight,
                function (t, e) {
                    return e
                        ? C.swap(t, { display: "inline-block" }, At, [
                              t,
                              "marginRight",
                          ])
                        : void 0
                }
            )),
            C.each(
                { margin: "", padding: "", border: "Width" },
                function (i, o) {
                    ;(C.cssHooks[i + o] = {
                        expand: function (t) {
                            for (
                                var e = 0,
                                    n = {},
                                    r =
                                        "string" == typeof t
                                            ? t.split(" ")
                                            : [t];
                                e < 4;
                                e++
                            )
                                n[i + M[e] + o] = r[e] || r[e - 2] || r[0]
                            return n
                        },
                    }),
                        St.test(i) || (C.cssHooks[i + o].set = Rt)
                }
            ),
            C.fn.extend({
                css: function (t, e) {
                    return q(
                        this,
                        function (t, e, n) {
                            var r,
                                i,
                                o = {},
                                s = 0
                            if (C.isArray(e)) {
                                for (r = kt(t), i = e.length; s < i; s++)
                                    o[e[s]] = C.css(t, e[s], !1, r)
                                return o
                            }
                            return void 0 !== n ? C.style(t, e, n) : C.css(t, e)
                        },
                        t,
                        e,
                        1 < arguments.length
                    )
                },
                show: function () {
                    return Ft(this, !0)
                },
                hide: function () {
                    return Ft(this)
                },
                toggle: function (t) {
                    return "boolean" == typeof t
                        ? t
                            ? this.show()
                            : this.hide()
                        : this.each(function () {
                              F(this) ? C(this).show() : C(this).hide()
                          })
                },
            }),
            ((C.Tween = Qt).prototype = {
                constructor: Qt,
                init: function (t, e, n, r, i, o) {
                    ;(this.elem = t),
                        (this.prop = n),
                        (this.easing = i || "swing"),
                        (this.options = e),
                        (this.start = this.now = this.cur()),
                        (this.end = r),
                        (this.unit = o || (C.cssNumber[n] ? "" : "px"))
                },
                cur: function () {
                    var t = Qt.propHooks[this.prop]
                    return t && t.get
                        ? t.get(this)
                        : Qt.propHooks._default.get(this)
                },
                run: function (t) {
                    var e,
                        n = Qt.propHooks[this.prop]
                    return (
                        (this.pos = e =
                            this.options.duration
                                ? C.easing[this.easing](
                                      t,
                                      this.options.duration * t,
                                      0,
                                      1,
                                      this.options.duration
                                  )
                                : t),
                        (this.now = (this.end - this.start) * e + this.start),
                        this.options.step &&
                            this.options.step.call(this.elem, this.now, this),
                        n && n.set
                            ? n.set(this)
                            : Qt.propHooks._default.set(this),
                        this
                    )
                },
            }),
            (Qt.prototype.init.prototype = Qt.prototype),
            (Qt.propHooks = {
                _default: {
                    get: function (t) {
                        var e
                        return null == t.elem[t.prop] ||
                            (t.elem.style && null != t.elem.style[t.prop])
                            ? (e = C.css(t.elem, t.prop, "")) && "auto" !== e
                                ? e
                                : 0
                            : t.elem[t.prop]
                    },
                    set: function (t) {
                        C.fx.step[t.prop]
                            ? C.fx.step[t.prop](t)
                            : t.elem.style &&
                              (null != t.elem.style[C.cssProps[t.prop]] ||
                                  C.cssHooks[t.prop])
                            ? C.style(t.elem, t.prop, t.now + t.unit)
                            : (t.elem[t.prop] = t.now)
                    },
                },
            }),
            (Qt.propHooks.scrollTop = Qt.propHooks.scrollLeft =
                {
                    set: function (t) {
                        t.elem.nodeType &&
                            t.elem.parentNode &&
                            (t.elem[t.prop] = t.now)
                    },
                }),
            (C.easing = {
                linear: function (t) {
                    return t
                },
                swing: function (t) {
                    return 0.5 - Math.cos(t * Math.PI) / 2
                },
            }),
            (C.fx = Qt.prototype.init),
            (C.fx.step = {})
        var Ut,
            Bt,
            Mt,
            Wt,
            zt,
            Vt = /^(?:toggle|show|hide)$/,
            Xt = new RegExp("^(?:([+-])=|)(" + B + ")([a-z%]*)$", "i"),
            Gt = /queueHooks$/,
            Yt = [
                function (e, t, n) {
                    var r,
                        i,
                        o,
                        s,
                        a,
                        l,
                        c,
                        u = this,
                        p = {},
                        h = e.style,
                        d = e.nodeType && F(e),
                        f = O.get(e, "fxshow")
                    for (r in (n.queue ||
                        (null == (a = C._queueHooks(e, "fx")).unqueued &&
                            ((a.unqueued = 0),
                            (l = a.empty.fire),
                            (a.empty.fire = function () {
                                a.unqueued || l()
                            })),
                        a.unqueued++,
                        u.always(function () {
                            u.always(function () {
                                a.unqueued--,
                                    C.queue(e, "fx").length || a.empty.fire()
                            })
                        })),
                    1 === e.nodeType &&
                        ("height" in t || "width" in t) &&
                        ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
                        (c = C.css(e, "display")),
                        "inline" ===
                            ("none" === c
                                ? O.get(e, "olddisplay") || yt(e.nodeName)
                                : c) &&
                            "none" === C.css(e, "float") &&
                            (h.display = "inline-block")),
                    n.overflow &&
                        ((h.overflow = "hidden"),
                        u.always(function () {
                            ;(h.overflow = n.overflow[0]),
                                (h.overflowX = n.overflow[1]),
                                (h.overflowY = n.overflow[2])
                        })),
                    t))
                        if (((i = t[r]), Vt.exec(i))) {
                            if (
                                (delete t[r],
                                (o = o || "toggle" === i),
                                i === (d ? "hide" : "show"))
                            ) {
                                if ("show" !== i || !f || void 0 === f[r])
                                    continue
                                d = !0
                            }
                            p[r] = (f && f[r]) || C.style(e, r)
                        } else c = void 0
                    if (C.isEmptyObject(p))
                        "inline" === ("none" === c ? yt(e.nodeName) : c) &&
                            (h.display = c)
                    else
                        for (r in (f
                            ? "hidden" in f && (d = f.hidden)
                            : (f = O.access(e, "fxshow", {})),
                        o && (f.hidden = !d),
                        d
                            ? C(e).show()
                            : u.done(function () {
                                  C(e).hide()
                              }),
                        u.done(function () {
                            var t
                            for (t in (O.remove(e, "fxshow"), p))
                                C.style(e, t, p[t])
                        }),
                        p))
                            (s = te(d ? f[r] : 0, r, u)),
                                r in f ||
                                    ((f[r] = s.start),
                                    d &&
                                        ((s.end = s.start),
                                        (s.start =
                                            "width" === r || "height" === r
                                                ? 1
                                                : 0)))
                },
            ],
            Jt = {
                "*": [
                    function (t, e) {
                        var n = this.createTween(t, e),
                            r = n.cur(),
                            i = Xt.exec(e),
                            o = (i && i[3]) || (C.cssNumber[t] ? "" : "px"),
                            s =
                                (C.cssNumber[t] || ("px" !== o && +r)) &&
                                Xt.exec(C.css(n.elem, t)),
                            a = 1,
                            l = 20
                        if (s && s[3] !== o)
                            for (
                                o = o || s[3], i = i || [], s = +r || 1;
                                (s /= a = a || ".5"),
                                    C.style(n.elem, t, s + o),
                                    a !== (a = n.cur() / r) && 1 !== a && --l;

                            );
                        return (
                            i &&
                                ((s = n.start = +s || +r || 0),
                                (n.unit = o),
                                (n.end = i[1] ? s + (i[1] + 1) * i[2] : +i[2])),
                            n
                        )
                    },
                ],
            }
        function Zt() {
            return (
                setTimeout(function () {
                    Ut = void 0
                }),
                (Ut = C.now())
            )
        }
        function Kt(t, e) {
            var n,
                r = 0,
                i = { height: t }
            for (e = e ? 1 : 0; r < 4; r += 2 - e)
                i["margin" + (n = M[r])] = i["padding" + n] = t
            return e && (i.opacity = i.width = t), i
        }
        function te(t, e, n) {
            for (
                var r, i = (Jt[e] || []).concat(Jt["*"]), o = 0, s = i.length;
                o < s;
                o++
            )
                if ((r = i[o].call(n, e, t))) return r
        }
        function ee(o, t, e) {
            var n,
                s,
                r = 0,
                i = Yt.length,
                a = C.Deferred().always(function () {
                    delete l.elem
                }),
                l = function () {
                    if (s) return !1
                    for (
                        var t = Ut || Zt(),
                            e = Math.max(0, c.startTime + c.duration - t),
                            n = 1 - (e / c.duration || 0),
                            r = 0,
                            i = c.tweens.length;
                        r < i;
                        r++
                    )
                        c.tweens[r].run(n)
                    return (
                        a.notifyWith(o, [c, n, e]),
                        n < 1 && i ? e : (a.resolveWith(o, [c]), !1)
                    )
                },
                c = a.promise({
                    elem: o,
                    props: C.extend({}, t),
                    opts: C.extend(!0, { specialEasing: {} }, e),
                    originalProperties: t,
                    originalOptions: e,
                    startTime: Ut || Zt(),
                    duration: e.duration,
                    tweens: [],
                    createTween: function (t, e) {
                        var n = C.Tween(
                            o,
                            c.opts,
                            t,
                            e,
                            c.opts.specialEasing[t] || c.opts.easing
                        )
                        return c.tweens.push(n), n
                    },
                    stop: function (t) {
                        var e = 0,
                            n = t ? c.tweens.length : 0
                        if (s) return this
                        for (s = !0; e < n; e++) c.tweens[e].run(1)
                        return (
                            t
                                ? a.resolveWith(o, [c, t])
                                : a.rejectWith(o, [c, t]),
                            this
                        )
                    },
                }),
                u = c.props
            for (
                (function (t, e) {
                    var n, r, i, o, s
                    for (n in t)
                        if (
                            ((i = e[(r = C.camelCase(n))]),
                            (o = t[n]),
                            C.isArray(o) && ((i = o[1]), (o = t[n] = o[0])),
                            n !== r && ((t[r] = o), delete t[n]),
                            (s = C.cssHooks[r]) && ("expand" in s))
                        )
                            for (n in ((o = s.expand(o)), delete t[r], o))
                                (n in t) || ((t[n] = o[n]), (e[n] = i))
                        else e[r] = i
                })(u, c.opts.specialEasing);
                r < i;
                r++
            )
                if ((n = Yt[r].call(c, o, u, c.opts))) return n
            return (
                C.map(u, te, c),
                C.isFunction(c.opts.start) && c.opts.start.call(o, c),
                C.fx.timer(
                    C.extend(l, { elem: o, anim: c, queue: c.opts.queue })
                ),
                c
                    .progress(c.opts.progress)
                    .done(c.opts.done, c.opts.complete)
                    .fail(c.opts.fail)
                    .always(c.opts.always)
            )
        }
        ;(C.Animation = C.extend(ee, {
            tweener: function (t, e) {
                for (
                    var n,
                        r = 0,
                        i = (t = C.isFunction(t)
                            ? ((e = t), ["*"])
                            : t.split(" ")).length;
                    r < i;
                    r++
                )
                    (n = t[r]), (Jt[n] = Jt[n] || []), Jt[n].unshift(e)
            },
            prefilter: function (t, e) {
                e ? Yt.unshift(t) : Yt.push(t)
            },
        })),
            (C.speed = function (t, e, n) {
                var r =
                    t && "object" == typeof t
                        ? C.extend({}, t)
                        : {
                              complete:
                                  n || (!n && e) || (C.isFunction(t) && t),
                              duration: t,
                              easing: (n && e) || (e && !C.isFunction(e) && e),
                          }
                return (
                    (r.duration = C.fx.off
                        ? 0
                        : "number" == typeof r.duration
                        ? r.duration
                        : r.duration in C.fx.speeds
                        ? C.fx.speeds[r.duration]
                        : C.fx.speeds._default),
                    (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
                    (r.old = r.complete),
                    (r.complete = function () {
                        C.isFunction(r.old) && r.old.call(this),
                            r.queue && C.dequeue(this, r.queue)
                    }),
                    r
                )
            }),
            C.fn.extend({
                fadeTo: function (t, e, n, r) {
                    return this.filter(F)
                        .css("opacity", 0)
                        .show()
                        .end()
                        .animate({ opacity: e }, t, n, r)
                },
                animate: function (e, t, n, r) {
                    function i() {
                        var t = ee(this, C.extend({}, e), s)
                        ;(o || O.get(this, "finish")) && t.stop(!0)
                    }
                    var o = C.isEmptyObject(e),
                        s = C.speed(t, n, r)
                    return (
                        (i.finish = i),
                        o || !1 === s.queue
                            ? this.each(i)
                            : this.queue(s.queue, i)
                    )
                },
                stop: function (i, t, o) {
                    function s(t) {
                        var e = t.stop
                        delete t.stop, e(o)
                    }
                    return (
                        "string" != typeof i &&
                            ((o = t), (t = i), (i = void 0)),
                        t && !1 !== i && this.queue(i || "fx", []),
                        this.each(function () {
                            var t = !0,
                                e = null != i && i + "queueHooks",
                                n = C.timers,
                                r = O.get(this)
                            if (e) r[e] && r[e].stop && s(r[e])
                            else
                                for (e in r)
                                    r[e] && r[e].stop && Gt.test(e) && s(r[e])
                            for (e = n.length; e--; )
                                n[e].elem !== this ||
                                    (null != i && n[e].queue !== i) ||
                                    (n[e].anim.stop(o),
                                    (t = !1),
                                    n.splice(e, 1))
                            ;(!t && o) || C.dequeue(this, i)
                        })
                    )
                },
                finish: function (s) {
                    return (
                        !1 !== s && (s = s || "fx"),
                        this.each(function () {
                            var t,
                                e = O.get(this),
                                n = e[s + "queue"],
                                r = e[s + "queueHooks"],
                                i = C.timers,
                                o = n ? n.length : 0
                            for (
                                e.finish = !0,
                                    C.queue(this, s, []),
                                    r && r.stop && r.stop.call(this, !0),
                                    t = i.length;
                                t--;

                            )
                                i[t].elem === this &&
                                    i[t].queue === s &&
                                    (i[t].anim.stop(!0), i.splice(t, 1))
                            for (t = 0; t < o; t++)
                                n[t] && n[t].finish && n[t].finish.call(this)
                            delete e.finish
                        })
                    )
                },
            }),
            C.each(["toggle", "show", "hide"], function (t, r) {
                var i = C.fn[r]
                C.fn[r] = function (t, e, n) {
                    return null == t || "boolean" == typeof t
                        ? i.apply(this, arguments)
                        : this.animate(Kt(r, !0), t, e, n)
                }
            }),
            C.each(
                {
                    slideDown: Kt("show"),
                    slideUp: Kt("hide"),
                    slideToggle: Kt("toggle"),
                    fadeIn: { opacity: "show" },
                    fadeOut: { opacity: "hide" },
                    fadeToggle: { opacity: "toggle" },
                },
                function (t, r) {
                    C.fn[t] = function (t, e, n) {
                        return this.animate(r, t, e, n)
                    }
                }
            ),
            (C.timers = []),
            (C.fx.tick = function () {
                var t,
                    e = 0,
                    n = C.timers
                for (Ut = C.now(); e < n.length; e++)
                    (t = n[e])() || n[e] !== t || n.splice(e--, 1)
                n.length || C.fx.stop(), (Ut = void 0)
            }),
            (C.fx.timer = function (t) {
                C.timers.push(t), t() ? C.fx.start() : C.timers.pop()
            }),
            (C.fx.interval = 13),
            (C.fx.start = function () {
                Bt = Bt || setInterval(C.fx.tick, C.fx.interval)
            }),
            (C.fx.stop = function () {
                clearInterval(Bt), (Bt = null)
            }),
            (C.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
            (C.fn.delay = function (r, t) {
                return (
                    (r = (C.fx && C.fx.speeds[r]) || r),
                    (t = t || "fx"),
                    this.queue(t, function (t, e) {
                        var n = setTimeout(t, r)
                        e.stop = function () {
                            clearTimeout(n)
                        }
                    })
                )
            }),
            (Mt = y.createElement("input")),
            (Wt = y.createElement("select")),
            (zt = Wt.appendChild(y.createElement("option"))),
            (Mt.type = "checkbox"),
            (v.checkOn = "" !== Mt.value),
            (v.optSelected = zt.selected),
            (Wt.disabled = !0),
            (v.optDisabled = !zt.disabled),
            ((Mt = y.createElement("input")).value = "t"),
            (Mt.type = "radio"),
            (v.radioValue = "t" === Mt.value)
        var ne,
            re = C.expr.attrHandle
        C.fn.extend({
            attr: function (t, e) {
                return q(this, C.attr, t, e, 1 < arguments.length)
            },
            removeAttr: function (t) {
                return this.each(function () {
                    C.removeAttr(this, t)
                })
            },
        }),
            C.extend({
                attr: function (t, e, n) {
                    var r,
                        i,
                        o = t.nodeType
                    if (t && 3 !== o && 8 !== o && 2 !== o)
                        return typeof t.getAttribute == z
                            ? C.prop(t, e, n)
                            : ((1 === o && C.isXMLDoc(t)) ||
                                  ((e = e.toLowerCase()),
                                  (r =
                                      C.attrHooks[e] ||
                                      (C.expr.match.bool.test(e)
                                          ? ne
                                          : void 0))),
                              void 0 === n
                                  ? r &&
                                    "get" in r &&
                                    null !== (i = r.get(t, e))
                                      ? i
                                      : null == (i = C.find.attr(t, e))
                                      ? void 0
                                      : i
                                  : null !== n
                                  ? r &&
                                    "set" in r &&
                                    void 0 !== (i = r.set(t, n, e))
                                      ? i
                                      : (t.setAttribute(e, n + ""), n)
                                  : void C.removeAttr(t, e))
                },
                removeAttr: function (t, e) {
                    var n,
                        r,
                        i = 0,
                        o = e && e.match(N)
                    if (o && 1 === t.nodeType)
                        for (; (n = o[i++]); )
                            (r = C.propFix[n] || n),
                                C.expr.match.bool.test(n) && (t[r] = !1),
                                t.removeAttribute(n)
                },
                attrHooks: {
                    type: {
                        set: function (t, e) {
                            if (
                                !v.radioValue &&
                                "radio" === e &&
                                C.nodeName(t, "input")
                            ) {
                                var n = t.value
                                return (
                                    t.setAttribute("type", e),
                                    n && (t.value = n),
                                    e
                                )
                            }
                        },
                    },
                },
            }),
            (ne = {
                set: function (t, e, n) {
                    return (
                        !1 === e ? C.removeAttr(t, n) : t.setAttribute(n, n), n
                    )
                },
            }),
            C.each(C.expr.match.bool.source.match(/\w+/g), function (t, e) {
                var o = re[e] || C.find.attr
                re[e] = function (t, e, n) {
                    var r, i
                    return (
                        n ||
                            ((i = re[e]),
                            (re[e] = r),
                            (r = null != o(t, e, n) ? e.toLowerCase() : null),
                            (re[e] = i)),
                        r
                    )
                }
            })
        var ie = /^(?:input|select|textarea|button)$/i
        C.fn.extend({
            prop: function (t, e) {
                return q(this, C.prop, t, e, 1 < arguments.length)
            },
            removeProp: function (t) {
                return this.each(function () {
                    delete this[C.propFix[t] || t]
                })
            },
        }),
            C.extend({
                propFix: { for: "htmlFor", class: "className" },
                prop: function (t, e, n) {
                    var r,
                        i,
                        o = t.nodeType
                    if (t && 3 !== o && 8 !== o && 2 !== o)
                        return (
                            (1 !== o || !C.isXMLDoc(t)) &&
                                ((e = C.propFix[e] || e), (i = C.propHooks[e])),
                            void 0 !== n
                                ? i &&
                                  "set" in i &&
                                  void 0 !== (r = i.set(t, n, e))
                                    ? r
                                    : (t[e] = n)
                                : i && "get" in i && null !== (r = i.get(t, e))
                                ? r
                                : t[e]
                        )
                },
                propHooks: {
                    tabIndex: {
                        get: function (t) {
                            return t.hasAttribute("tabindex") ||
                                ie.test(t.nodeName) ||
                                t.href
                                ? t.tabIndex
                                : -1
                        },
                    },
                },
            }),
            v.optSelected ||
                (C.propHooks.selected = {
                    get: function (t) {
                        var e = t.parentNode
                        return (
                            e && e.parentNode && e.parentNode.selectedIndex,
                            null
                        )
                    },
                }),
            C.each(
                [
                    "tabIndex",
                    "readOnly",
                    "maxLength",
                    "cellSpacing",
                    "cellPadding",
                    "rowSpan",
                    "colSpan",
                    "useMap",
                    "frameBorder",
                    "contentEditable",
                ],
                function () {
                    C.propFix[this.toLowerCase()] = this
                }
            )
        var oe = /[\t\r\n\f]/g
        C.fn.extend({
            addClass: function (e) {
                var t,
                    n,
                    r,
                    i,
                    o,
                    s,
                    a = "string" == typeof e && e,
                    l = 0,
                    c = this.length
                if (C.isFunction(e))
                    return this.each(function (t) {
                        C(this).addClass(e.call(this, t, this.className))
                    })
                if (a)
                    for (t = (e || "").match(N) || []; l < c; l++)
                        if (
                            (r =
                                1 === (n = this[l]).nodeType &&
                                (n.className
                                    ? (" " + n.className + " ").replace(oe, " ")
                                    : " "))
                        ) {
                            for (o = 0; (i = t[o++]); )
                                r.indexOf(" " + i + " ") < 0 && (r += i + " ")
                            ;(s = C.trim(r)),
                                n.className !== s && (n.className = s)
                        }
                return this
            },
            removeClass: function (e) {
                var t,
                    n,
                    r,
                    i,
                    o,
                    s,
                    a = 0 === arguments.length || ("string" == typeof e && e),
                    l = 0,
                    c = this.length
                if (C.isFunction(e))
                    return this.each(function (t) {
                        C(this).removeClass(e.call(this, t, this.className))
                    })
                if (a)
                    for (t = (e || "").match(N) || []; l < c; l++)
                        if (
                            (r =
                                1 === (n = this[l]).nodeType &&
                                (n.className
                                    ? (" " + n.className + " ").replace(oe, " ")
                                    : ""))
                        ) {
                            for (o = 0; (i = t[o++]); )
                                for (; 0 <= r.indexOf(" " + i + " "); )
                                    r = r.replace(" " + i + " ", " ")
                            ;(s = e ? C.trim(r) : ""),
                                n.className !== s && (n.className = s)
                        }
                return this
            },
            toggleClass: function (i, e) {
                var o = typeof i
                return "boolean" == typeof e && "string" == o
                    ? e
                        ? this.addClass(i)
                        : this.removeClass(i)
                    : this.each(
                          C.isFunction(i)
                              ? function (t) {
                                    C(this).toggleClass(
                                        i.call(this, t, this.className, e),
                                        e
                                    )
                                }
                              : function () {
                                    if ("string" == o)
                                        for (
                                            var t,
                                                e = 0,
                                                n = C(this),
                                                r = i.match(N) || [];
                                            (t = r[e++]);

                                        )
                                            n.hasClass(t)
                                                ? n.removeClass(t)
                                                : n.addClass(t)
                                    else
                                        (o != z && "boolean" != o) ||
                                            (this.className &&
                                                O.set(
                                                    this,
                                                    "__className__",
                                                    this.className
                                                ),
                                            (this.className =
                                                (!this.className &&
                                                    !1 !== i &&
                                                    O.get(
                                                        this,
                                                        "__className__"
                                                    )) ||
                                                ""))
                                }
                      )
            },
            hasClass: function (t) {
                for (var e = " " + t + " ", n = 0, r = this.length; n < r; n++)
                    if (
                        1 === this[n].nodeType &&
                        0 <=
                            (" " + this[n].className + " ")
                                .replace(oe, " ")
                                .indexOf(e)
                    )
                        return !0
                return !1
            },
        })
        var se = /\r/g
        C.fn.extend({
            val: function (n) {
                var r,
                    t,
                    i,
                    e = this[0]
                return arguments.length
                    ? ((i = C.isFunction(n)),
                      this.each(function (t) {
                          var e
                          1 === this.nodeType &&
                              (null ==
                              (e = i ? n.call(this, t, C(this).val()) : n)
                                  ? (e = "")
                                  : "number" == typeof e
                                  ? (e += "")
                                  : C.isArray(e) &&
                                    (e = C.map(e, function (t) {
                                        return null == t ? "" : t + ""
                                    })),
                              ((r =
                                  C.valHooks[this.type] ||
                                  C.valHooks[this.nodeName.toLowerCase()]) &&
                                  "set" in r &&
                                  void 0 !== r.set(this, e, "value")) ||
                                  (this.value = e))
                      }))
                    : e
                    ? (r =
                          C.valHooks[e.type] ||
                          C.valHooks[e.nodeName.toLowerCase()]) &&
                      "get" in r &&
                      void 0 !== (t = r.get(e, "value"))
                        ? t
                        : "string" == typeof (t = e.value)
                        ? t.replace(se, "")
                        : null == t
                        ? ""
                        : t
                    : void 0
            },
        }),
            C.extend({
                valHooks: {
                    option: {
                        get: function (t) {
                            var e = C.find.attr(t, "value")
                            return null != e ? e : C.trim(C.text(t))
                        },
                    },
                    select: {
                        get: function (t) {
                            for (
                                var e,
                                    n,
                                    r = t.options,
                                    i = t.selectedIndex,
                                    o = "select-one" === t.type || i < 0,
                                    s = o ? null : [],
                                    a = o ? i + 1 : r.length,
                                    l = i < 0 ? a : o ? i : 0;
                                l < a;
                                l++
                            )
                                if (
                                    !(
                                        (!(n = r[l]).selected && l !== i) ||
                                        (v.optDisabled
                                            ? n.disabled
                                            : null !==
                                              n.getAttribute("disabled")) ||
                                        (n.parentNode.disabled &&
                                            C.nodeName(
                                                n.parentNode,
                                                "optgroup"
                                            ))
                                    )
                                ) {
                                    if (((e = C(n).val()), o)) return e
                                    s.push(e)
                                }
                            return s
                        },
                        set: function (t, e) {
                            for (
                                var n,
                                    r,
                                    i = t.options,
                                    o = C.makeArray(e),
                                    s = i.length;
                                s--;

                            )
                                ((r = i[s]).selected =
                                    0 <= C.inArray(r.value, o)) && (n = !0)
                            return n || (t.selectedIndex = -1), o
                        },
                    },
                },
            }),
            C.each(["radio", "checkbox"], function () {
                ;(C.valHooks[this] = {
                    set: function (t, e) {
                        return C.isArray(e)
                            ? (t.checked = 0 <= C.inArray(C(t).val(), e))
                            : void 0
                    },
                }),
                    v.checkOn ||
                        (C.valHooks[this].get = function (t) {
                            return null === t.getAttribute("value")
                                ? "on"
                                : t.value
                        })
            }),
            C.each(
                "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
                    " "
                ),
                function (t, n) {
                    C.fn[n] = function (t, e) {
                        return 0 < arguments.length
                            ? this.on(n, null, t, e)
                            : this.trigger(n)
                    }
                }
            ),
            C.fn.extend({
                hover: function (t, e) {
                    return this.mouseenter(t).mouseleave(e || t)
                },
                bind: function (t, e, n) {
                    return this.on(t, null, e, n)
                },
                unbind: function (t, e) {
                    return this.off(t, null, e)
                },
                delegate: function (t, e, n, r) {
                    return this.on(e, t, n, r)
                },
                undelegate: function (t, e, n) {
                    return 1 === arguments.length
                        ? this.off(t, "**")
                        : this.off(e, t || "**", n)
                },
            })
        var ae = C.now(),
            le = /\?/
        ;(C.parseJSON = function (t) {
            return JSON.parse(t + "")
        }),
            (C.parseXML = function (t) {
                var e
                if (!t || "string" != typeof t) return null
                try {
                    e = new DOMParser().parseFromString(t, "text/xml")
                } catch (t) {
                    e = void 0
                }
                return (
                    (e && !e.getElementsByTagName("parsererror").length) ||
                        C.error("Invalid XML: " + t),
                    e
                )
            })
        var ce = /#.*$/,
            ue = /([?&])_=[^&]*/,
            pe = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            he = /^(?:GET|HEAD)$/,
            de = /^\/\//,
            fe = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            ge = {},
            me = {},
            ve = "*/".concat("*"),
            ye = f.location.href,
            be = fe.exec(ye.toLowerCase()) || []
        function we(o) {
            return function (t, e) {
                "string" != typeof t && ((e = t), (t = "*"))
                var n,
                    r = 0,
                    i = t.toLowerCase().match(N) || []
                if (C.isFunction(e))
                    for (; (n = i[r++]); )
                        "+" === n[0]
                            ? ((n = n.slice(1) || "*"),
                              (o[n] = o[n] || []).unshift(e))
                            : (o[n] = o[n] || []).push(e)
            }
        }
        function xe(e, i, o, s) {
            var a = {},
                l = e === me
            function c(t) {
                var r
                return (
                    (a[t] = !0),
                    C.each(e[t] || [], function (t, e) {
                        var n = e(i, o, s)
                        return "string" != typeof n || l || a[n]
                            ? l
                                ? !(r = n)
                                : void 0
                            : (i.dataTypes.unshift(n), c(n), !1)
                    }),
                    r
                )
            }
            return c(i.dataTypes[0]) || (!a["*"] && c("*"))
        }
        function Te(t, e) {
            var n,
                r,
                i = C.ajaxSettings.flatOptions || {}
            for (n in e)
                void 0 !== e[n] && ((i[n] ? t : (r = r || {}))[n] = e[n])
            return r && C.extend(!0, t, r), t
        }
        C.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: ye,
                type: "GET",
                isLocal:
                    /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
                        be[1]
                    ),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": ve,
                    "text": "text/plain",
                    "html": "text/html",
                    "xml": "application/xml, text/xml",
                    "json": "application/json, text/javascript",
                },
                contents: { xml: /xml/, html: /html/, json: /json/ },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON",
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": C.parseJSON,
                    "text xml": C.parseXML,
                },
                flatOptions: { url: !0, context: !0 },
            },
            ajaxSetup: function (t, e) {
                return e ? Te(Te(t, C.ajaxSettings), e) : Te(C.ajaxSettings, t)
            },
            ajaxPrefilter: we(ge),
            ajaxTransport: we(me),
            ajax: function (t, e) {
                "object" == typeof t && ((e = t), (t = void 0)), (e = e || {})
                var u,
                    p,
                    h,
                    n,
                    d,
                    r,
                    f,
                    i,
                    g = C.ajaxSetup({}, e),
                    m = g.context || g,
                    v = g.context && (m.nodeType || m.jquery) ? C(m) : C.event,
                    y = C.Deferred(),
                    b = C.Callbacks("once memory"),
                    w = g.statusCode || {},
                    o = {},
                    s = {},
                    x = 0,
                    a = "canceled",
                    T = {
                        readyState: 0,
                        getResponseHeader: function (t) {
                            var e
                            if (2 === x) {
                                if (!n)
                                    for (n = {}; (e = pe.exec(h)); )
                                        n[e[1].toLowerCase()] = e[2]
                                e = n[t.toLowerCase()]
                            }
                            return null == e ? null : e
                        },
                        getAllResponseHeaders: function () {
                            return 2 === x ? h : null
                        },
                        setRequestHeader: function (t, e) {
                            var n = t.toLowerCase()
                            return (
                                x || ((t = s[n] = s[n] || t), (o[t] = e)), this
                            )
                        },
                        overrideMimeType: function (t) {
                            return x || (g.mimeType = t), this
                        },
                        statusCode: function (t) {
                            var e
                            if (t)
                                if (x < 2) for (e in t) w[e] = [w[e], t[e]]
                                else T.always(t[T.status])
                            return this
                        },
                        abort: function (t) {
                            var e = t || a
                            return u && u.abort(e), l(0, e), this
                        },
                    }
                if (
                    ((y.promise(T).complete = b.add),
                    (T.success = T.done),
                    (T.error = T.fail),
                    (g.url = ((t || g.url || ye) + "")
                        .replace(ce, "")
                        .replace(de, be[1] + "//")),
                    (g.type = e.method || e.type || g.method || g.type),
                    (g.dataTypes = C.trim(g.dataType || "*")
                        .toLowerCase()
                        .match(N) || [""]),
                    null == g.crossDomain &&
                        ((r = fe.exec(g.url.toLowerCase())),
                        (g.crossDomain = !(
                            !r ||
                            (r[1] === be[1] &&
                                r[2] === be[2] &&
                                (r[3] || ("http:" === r[1] ? "80" : "443")) ===
                                    (be[3] ||
                                        ("http:" === be[1] ? "80" : "443")))
                        ))),
                    g.data &&
                        g.processData &&
                        "string" != typeof g.data &&
                        (g.data = C.param(g.data, g.traditional)),
                    xe(ge, g, e, T),
                    2 === x)
                )
                    return T
                for (i in ((f = C.event && g.global) &&
                    0 == C.active++ &&
                    C.event.trigger("ajaxStart"),
                (g.type = g.type.toUpperCase()),
                (g.hasContent = !he.test(g.type)),
                (p = g.url),
                g.hasContent ||
                    (g.data &&
                        ((p = g.url += (le.test(p) ? "&" : "?") + g.data),
                        delete g.data),
                    !1 === g.cache &&
                        (g.url = ue.test(p)
                            ? p.replace(ue, "$1_=" + ae++)
                            : p + (le.test(p) ? "&" : "?") + "_=" + ae++)),
                g.ifModified &&
                    (C.lastModified[p] &&
                        T.setRequestHeader(
                            "If-Modified-Since",
                            C.lastModified[p]
                        ),
                    C.etag[p] &&
                        T.setRequestHeader("If-None-Match", C.etag[p])),
                ((g.data && g.hasContent && !1 !== g.contentType) ||
                    e.contentType) &&
                    T.setRequestHeader("Content-Type", g.contentType),
                T.setRequestHeader(
                    "Accept",
                    g.dataTypes[0] && g.accepts[g.dataTypes[0]]
                        ? g.accepts[g.dataTypes[0]] +
                              ("*" !== g.dataTypes[0]
                                  ? ", " + ve + "; q=0.01"
                                  : "")
                        : g.accepts["*"]
                ),
                g.headers))
                    T.setRequestHeader(i, g.headers[i])
                if (
                    g.beforeSend &&
                    (!1 === g.beforeSend.call(m, T, g) || 2 === x)
                )
                    return T.abort()
                for (i in ((a = "abort"),
                { success: 1, error: 1, complete: 1 }))
                    T[i](g[i])
                if ((u = xe(me, g, e, T))) {
                    ;(T.readyState = 1),
                        f && v.trigger("ajaxSend", [T, g]),
                        g.async &&
                            0 < g.timeout &&
                            (d = setTimeout(function () {
                                T.abort("timeout")
                            }, g.timeout))
                    try {
                        ;(x = 1), u.send(o, l)
                    } catch (t) {
                        if (!(x < 2)) throw t
                        l(-1, t)
                    }
                } else l(-1, "No Transport")
                function l(t, e, n, r) {
                    var i,
                        o,
                        s,
                        a,
                        l,
                        c = e
                    2 !== x &&
                        ((x = 2),
                        d && clearTimeout(d),
                        (u = void 0),
                        (h = r || ""),
                        (T.readyState = 0 < t ? 4 : 0),
                        (i = (200 <= t && t < 300) || 304 === t),
                        n &&
                            (a = (function (t, e, n) {
                                for (
                                    var r,
                                        i,
                                        o,
                                        s,
                                        a = t.contents,
                                        l = t.dataTypes;
                                    "*" === l[0];

                                )
                                    l.shift(),
                                        void 0 === r &&
                                            (r =
                                                t.mimeType ||
                                                e.getResponseHeader(
                                                    "Content-Type"
                                                ))
                                if (r)
                                    for (i in a)
                                        if (a[i] && a[i].test(r)) {
                                            l.unshift(i)
                                            break
                                        }
                                if (l[0] in n) o = l[0]
                                else {
                                    for (i in n) {
                                        if (
                                            !l[0] ||
                                            t.converters[i + " " + l[0]]
                                        ) {
                                            o = i
                                            break
                                        }
                                        s = s || i
                                    }
                                    o = o || s
                                }
                                return o
                                    ? (o !== l[0] && l.unshift(o), n[o])
                                    : void 0
                            })(g, T, n)),
                        (a = (function (t, e, n, r) {
                            var i,
                                o,
                                s,
                                a,
                                l,
                                c = {},
                                u = t.dataTypes.slice()
                            if (u[1])
                                for (s in t.converters)
                                    c[s.toLowerCase()] = t.converters[s]
                            for (o = u.shift(); o; )
                                if (
                                    (t.responseFields[o] &&
                                        (n[t.responseFields[o]] = e),
                                    !l &&
                                        r &&
                                        t.dataFilter &&
                                        (e = t.dataFilter(e, t.dataType)),
                                    (l = o),
                                    (o = u.shift()))
                                )
                                    if ("*" === o) o = l
                                    else if ("*" !== l && l !== o) {
                                        if (
                                            !(s = c[l + " " + o] || c["* " + o])
                                        )
                                            for (i in c)
                                                if (
                                                    (a = i.split(" "))[1] ===
                                                        o &&
                                                    (s =
                                                        c[l + " " + a[0]] ||
                                                        c["* " + a[0]])
                                                ) {
                                                    !0 === s
                                                        ? (s = c[i])
                                                        : !0 !== c[i] &&
                                                          ((o = a[0]),
                                                          u.unshift(a[1]))
                                                    break
                                                }
                                        if (!0 !== s)
                                            if (s && t.throws) e = s(e)
                                            else
                                                try {
                                                    e = s(e)
                                                } catch (t) {
                                                    return {
                                                        state: "parsererror",
                                                        error: s
                                                            ? t
                                                            : "No conversion from " +
                                                              l +
                                                              " to " +
                                                              o,
                                                    }
                                                }
                                    }
                            return { state: "success", data: e }
                        })(g, a, T, i)),
                        i
                            ? (g.ifModified &&
                                  ((l = T.getResponseHeader("Last-Modified")) &&
                                      (C.lastModified[p] = l),
                                  (l = T.getResponseHeader("etag")) &&
                                      (C.etag[p] = l)),
                              204 === t || "HEAD" === g.type
                                  ? (c = "nocontent")
                                  : 304 === t
                                  ? (c = "notmodified")
                                  : ((c = a.state),
                                    (o = a.data),
                                    (i = !(s = a.error))))
                            : ((s = c),
                              (!t && c) || ((c = "error"), t < 0 && (t = 0))),
                        (T.status = t),
                        (T.statusText = (e || c) + ""),
                        i
                            ? y.resolveWith(m, [o, c, T])
                            : y.rejectWith(m, [T, c, s]),
                        T.statusCode(w),
                        (w = void 0),
                        f &&
                            v.trigger(i ? "ajaxSuccess" : "ajaxError", [
                                T,
                                g,
                                i ? o : s,
                            ]),
                        b.fireWith(m, [T, c]),
                        f &&
                            (v.trigger("ajaxComplete", [T, g]),
                            --C.active || C.event.trigger("ajaxStop")))
                }
                return T
            },
            getJSON: function (t, e, n) {
                return C.get(t, e, n, "json")
            },
            getScript: function (t, e) {
                return C.get(t, void 0, e, "script")
            },
        }),
            C.each(["get", "post"], function (t, i) {
                C[i] = function (t, e, n, r) {
                    return (
                        C.isFunction(e) &&
                            ((r = r || n), (n = e), (e = void 0)),
                        C.ajax({
                            url: t,
                            type: i,
                            dataType: r,
                            data: e,
                            success: n,
                        })
                    )
                }
            }),
            (C._evalUrl = function (t) {
                return C.ajax({
                    url: t,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    throws: !0,
                })
            }),
            C.fn.extend({
                wrapAll: function (e) {
                    var t
                    return C.isFunction(e)
                        ? this.each(function (t) {
                              C(this).wrapAll(e.call(this, t))
                          })
                        : (this[0] &&
                              ((t = C(e, this[0].ownerDocument)
                                  .eq(0)
                                  .clone(!0)),
                              this[0].parentNode && t.insertBefore(this[0]),
                              t
                                  .map(function () {
                                      for (var t = this; t.firstElementChild; )
                                          t = t.firstElementChild
                                      return t
                                  })
                                  .append(this)),
                          this)
                },
                wrapInner: function (n) {
                    return this.each(
                        C.isFunction(n)
                            ? function (t) {
                                  C(this).wrapInner(n.call(this, t))
                              }
                            : function () {
                                  var t = C(this),
                                      e = t.contents()
                                  e.length ? e.wrapAll(n) : t.append(n)
                              }
                    )
                },
                wrap: function (e) {
                    var n = C.isFunction(e)
                    return this.each(function (t) {
                        C(this).wrapAll(n ? e.call(this, t) : e)
                    })
                },
                unwrap: function () {
                    return this.parent()
                        .each(function () {
                            C.nodeName(this, "body") ||
                                C(this).replaceWith(this.childNodes)
                        })
                        .end()
                },
            }),
            (C.expr.filters.hidden = function (t) {
                return t.offsetWidth <= 0 && t.offsetHeight <= 0
            }),
            (C.expr.filters.visible = function (t) {
                return !C.expr.filters.hidden(t)
            })
        var Ce = /%20/g,
            Se = /\[\]$/,
            Ee = /\r?\n/g,
            ke = /^(?:submit|button|image|reset|file)$/i,
            Ae = /^(?:input|select|textarea|keygen)/i
        ;(C.param = function (t, e) {
            function n(t, e) {
                ;(e = C.isFunction(e) ? e() : null == e ? "" : e),
                    (i[i.length] =
                        encodeURIComponent(t) + "=" + encodeURIComponent(e))
            }
            var r,
                i = []
            if (
                (void 0 === e &&
                    (e = C.ajaxSettings && C.ajaxSettings.traditional),
                C.isArray(t) || (t.jquery && !C.isPlainObject(t)))
            )
                C.each(t, function () {
                    n(this.name, this.value)
                })
            else
                for (r in t)
                    !(function n(r, t, i, o) {
                        var e
                        if (C.isArray(t))
                            C.each(t, function (t, e) {
                                i || Se.test(r)
                                    ? o(r, e)
                                    : n(
                                          r +
                                              "[" +
                                              ("object" == typeof e ? t : "") +
                                              "]",
                                          e,
                                          i,
                                          o
                                      )
                            })
                        else if (i || "object" !== C.type(t)) o(r, t)
                        else for (e in t) n(r + "[" + e + "]", t[e], i, o)
                    })(r, t[r], e, n)
            return i.join("&").replace(Ce, "+")
        }),
            C.fn.extend({
                serialize: function () {
                    return C.param(this.serializeArray())
                },
                serializeArray: function () {
                    return this.map(function () {
                        var t = C.prop(this, "elements")
                        return t ? C.makeArray(t) : this
                    })
                        .filter(function () {
                            var t = this.type
                            return (
                                this.name &&
                                !C(this).is(":disabled") &&
                                Ae.test(this.nodeName) &&
                                !ke.test(t) &&
                                (this.checked || !W.test(t))
                            )
                        })
                        .map(function (t, e) {
                            var n = C(this).val()
                            return null == n
                                ? null
                                : C.isArray(n)
                                ? C.map(n, function (t) {
                                      return {
                                          name: e.name,
                                          value: t.replace(Ee, "\r\n"),
                                      }
                                  })
                                : { name: e.name, value: n.replace(Ee, "\r\n") }
                        })
                        .get()
                },
            }),
            (C.ajaxSettings.xhr = function () {
                try {
                    return new XMLHttpRequest()
                } catch (t) {}
            })
        var _e = 0,
            $e = {},
            Ne = { 0: 200, 1223: 204 },
            De = C.ajaxSettings.xhr()
        f.attachEvent &&
            f.attachEvent("onunload", function () {
                for (var t in $e) $e[t]()
            }),
            (v.cors = !!De && "withCredentials" in De),
            (v.ajax = De = !!De),
            C.ajaxTransport(function (o) {
                var s
                return v.cors || (De && !o.crossDomain)
                    ? {
                          send: function (t, e) {
                              var n,
                                  r = o.xhr(),
                                  i = ++_e
                              if (
                                  (r.open(
                                      o.type,
                                      o.url,
                                      o.async,
                                      o.username,
                                      o.password
                                  ),
                                  o.xhrFields)
                              )
                                  for (n in o.xhrFields) r[n] = o.xhrFields[n]
                              for (n in (o.mimeType &&
                                  r.overrideMimeType &&
                                  r.overrideMimeType(o.mimeType),
                              o.crossDomain ||
                                  t["X-Requested-With"] ||
                                  (t["X-Requested-With"] = "XMLHttpRequest"),
                              t))
                                  r.setRequestHeader(n, t[n])
                              ;(s = function (t) {
                                  return function () {
                                      s &&
                                          (delete $e[i],
                                          (s = r.onload = r.onerror = null),
                                          "abort" === t
                                              ? r.abort()
                                              : "error" === t
                                              ? e(r.status, r.statusText)
                                              : e(
                                                    Ne[r.status] || r.status,
                                                    r.statusText,
                                                    "string" ==
                                                        typeof r.responseText
                                                        ? {
                                                              text: r.responseText,
                                                          }
                                                        : void 0,
                                                    r.getAllResponseHeaders()
                                                ))
                                  }
                              }),
                                  (r.onload = s()),
                                  (r.onerror = s("error")),
                                  (s = $e[i] = s("abort"))
                              try {
                                  r.send((o.hasContent && o.data) || null)
                              } catch (t) {
                                  if (s) throw t
                              }
                          },
                          abort: function () {
                              s && s()
                          },
                      }
                    : void 0
            }),
            C.ajaxSetup({
                accepts: {
                    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
                },
                contents: { script: /(?:java|ecma)script/ },
                converters: {
                    "text script": function (t) {
                        return C.globalEval(t), t
                    },
                },
            }),
            C.ajaxPrefilter("script", function (t) {
                void 0 === t.cache && (t.cache = !1),
                    t.crossDomain && (t.type = "GET")
            }),
            C.ajaxTransport("script", function (n) {
                var r, i
                if (n.crossDomain)
                    return {
                        send: function (t, e) {
                            ;(r = C("<script>")
                                .prop({
                                    async: !0,
                                    charset: n.scriptCharset,
                                    src: n.url,
                                })
                                .on(
                                    "load error",
                                    (i = function (t) {
                                        r.remove(),
                                            (i = null),
                                            t &&
                                                e(
                                                    "error" === t.type
                                                        ? 404
                                                        : 200,
                                                    t.type
                                                )
                                    })
                                )),
                                y.head.appendChild(r[0])
                        },
                        abort: function () {
                            i && i()
                        },
                    }
            })
        var je = [],
            qe = /(=)\?(?=&|$)|\?\?/
        C.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function () {
                var t = je.pop() || C.expando + "_" + ae++
                return (this[t] = !0), t
            },
        }),
            C.ajaxPrefilter("json jsonp", function (t, e, n) {
                var r,
                    i,
                    o,
                    s =
                        !1 !== t.jsonp &&
                        (qe.test(t.url)
                            ? "url"
                            : "string" == typeof t.data &&
                              !(t.contentType || "").indexOf(
                                  "application/x-www-form-urlencoded"
                              ) &&
                              qe.test(t.data) &&
                              "data")
                return s || "jsonp" === t.dataTypes[0]
                    ? ((r = t.jsonpCallback =
                          C.isFunction(t.jsonpCallback)
                              ? t.jsonpCallback()
                              : t.jsonpCallback),
                      s
                          ? (t[s] = t[s].replace(qe, "$1" + r))
                          : !1 !== t.jsonp &&
                            (t.url +=
                                (le.test(t.url) ? "&" : "?") +
                                t.jsonp +
                                "=" +
                                r),
                      (t.converters["script json"] = function () {
                          return o || C.error(r + " was not called"), o[0]
                      }),
                      (t.dataTypes[0] = "json"),
                      (i = f[r]),
                      (f[r] = function () {
                          o = arguments
                      }),
                      n.always(function () {
                          ;(f[r] = i),
                              t[r] &&
                                  ((t.jsonpCallback = e.jsonpCallback),
                                  je.push(r)),
                              o && C.isFunction(i) && i(o[0]),
                              (o = i = void 0)
                      }),
                      "script")
                    : void 0
            }),
            (C.parseHTML = function (t, e, n) {
                if (!t || "string" != typeof t) return null
                "boolean" == typeof e && ((n = e), (e = !1)), (e = e || y)
                var r = w.exec(t),
                    i = !n && []
                return r
                    ? [e.createElement(r[1])]
                    : ((r = C.buildFragment([t], e, i)),
                      i && i.length && C(i).remove(),
                      C.merge([], r.childNodes))
            })
        var Ie = C.fn.load
        ;(C.fn.load = function (t, e, n) {
            if ("string" != typeof t && Ie) return Ie.apply(this, arguments)
            var r,
                i,
                o,
                s = this,
                a = t.indexOf(" ")
            return (
                0 <= a && ((r = C.trim(t.slice(a))), (t = t.slice(0, a))),
                C.isFunction(e)
                    ? ((n = e), (e = void 0))
                    : e && "object" == typeof e && (i = "POST"),
                0 < s.length &&
                    C.ajax({ url: t, type: i, dataType: "html", data: e })
                        .done(function (t) {
                            ;(o = arguments),
                                s.html(
                                    r
                                        ? C("<div>")
                                              .append(C.parseHTML(t))
                                              .find(r)
                                        : t
                                )
                        })
                        .complete(
                            n &&
                                function (t, e) {
                                    s.each(n, o || [t.responseText, e, t])
                                }
                        ),
                this
            )
        }),
            C.each(
                [
                    "ajaxStart",
                    "ajaxStop",
                    "ajaxComplete",
                    "ajaxError",
                    "ajaxSuccess",
                    "ajaxSend",
                ],
                function (t, e) {
                    C.fn[e] = function (t) {
                        return this.on(e, t)
                    }
                }
            ),
            (C.expr.filters.animated = function (e) {
                return C.grep(C.timers, function (t) {
                    return e === t.elem
                }).length
            })
        var Oe = f.document.documentElement
        function Pe(t) {
            return C.isWindow(t) ? t : 9 === t.nodeType && t.defaultView
        }
        ;(C.offset = {
            setOffset: function (t, e, n) {
                var r,
                    i,
                    o,
                    s,
                    a,
                    l,
                    c = C.css(t, "position"),
                    u = C(t),
                    p = {}
                "static" === c && (t.style.position = "relative"),
                    (a = u.offset()),
                    (o = C.css(t, "top")),
                    (l = C.css(t, "left")),
                    (i =
                        ("absolute" === c || "fixed" === c) &&
                        -1 < (o + l).indexOf("auto")
                            ? ((s = (r = u.position()).top), r.left)
                            : ((s = parseFloat(o) || 0), parseFloat(l) || 0)),
                    C.isFunction(e) && (e = e.call(t, n, a)),
                    null != e.top && (p.top = e.top - a.top + s),
                    null != e.left && (p.left = e.left - a.left + i),
                    "using" in e ? e.using.call(t, p) : u.css(p)
            },
        }),
            C.fn.extend({
                offset: function (e) {
                    if (arguments.length)
                        return void 0 === e
                            ? this
                            : this.each(function (t) {
                                  C.offset.setOffset(this, e, t)
                              })
                    var t,
                        n,
                        r = this[0],
                        i = { top: 0, left: 0 },
                        o = r && r.ownerDocument
                    return o
                        ? ((t = o.documentElement),
                          C.contains(t, r)
                              ? (typeof r.getBoundingClientRect != z &&
                                    (i = r.getBoundingClientRect()),
                                (n = Pe(o)),
                                {
                                    top: i.top + n.pageYOffset - t.clientTop,
                                    left: i.left + n.pageXOffset - t.clientLeft,
                                })
                              : i)
                        : void 0
                },
                position: function () {
                    if (this[0]) {
                        var t,
                            e,
                            n = this[0],
                            r = { top: 0, left: 0 }
                        return (
                            "fixed" === C.css(n, "position")
                                ? (e = n.getBoundingClientRect())
                                : ((t = this.offsetParent()),
                                  (e = this.offset()),
                                  C.nodeName(t[0], "html") || (r = t.offset()),
                                  (r.top += C.css(t[0], "borderTopWidth", !0)),
                                  (r.left += C.css(
                                      t[0],
                                      "borderLeftWidth",
                                      !0
                                  ))),
                            {
                                top: e.top - r.top - C.css(n, "marginTop", !0),
                                left:
                                    e.left -
                                    r.left -
                                    C.css(n, "marginLeft", !0),
                            }
                        )
                    }
                },
                offsetParent: function () {
                    return this.map(function () {
                        for (
                            var t = this.offsetParent || Oe;
                            t &&
                            !C.nodeName(t, "html") &&
                            "static" === C.css(t, "position");

                        )
                            t = t.offsetParent
                        return t || Oe
                    })
                },
            }),
            C.each(
                { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
                function (e, i) {
                    var o = "pageYOffset" === i
                    C.fn[e] = function (t) {
                        return q(
                            this,
                            function (t, e, n) {
                                var r = Pe(t)
                                return void 0 === n
                                    ? r
                                        ? r[i]
                                        : t[e]
                                    : void (r
                                          ? r.scrollTo(
                                                o ? f.pageXOffset : n,
                                                o ? n : f.pageYOffset
                                            )
                                          : (t[e] = n))
                            },
                            e,
                            t,
                            arguments.length,
                            null
                        )
                    }
                }
            ),
            C.each(["top", "left"], function (t, n) {
                C.cssHooks[n] = _t(v.pixelPosition, function (t, e) {
                    return e
                        ? ((e = At(t, n)),
                          Et.test(e) ? C(t).position()[n] + "px" : e)
                        : void 0
                })
            }),
            C.each({ Height: "height", Width: "width" }, function (o, s) {
                C.each(
                    { "padding": "inner" + o, "content": s, "": "outer" + o },
                    function (r, t) {
                        C.fn[t] = function (t, e) {
                            var n =
                                    arguments.length &&
                                    (r || "boolean" != typeof t),
                                i =
                                    r ||
                                    (!0 === t || !0 === e ? "margin" : "border")
                            return q(
                                this,
                                function (t, e, n) {
                                    var r
                                    return C.isWindow(t)
                                        ? t.document.documentElement[
                                              "client" + o
                                          ]
                                        : 9 === t.nodeType
                                        ? ((r = t.documentElement),
                                          Math.max(
                                              t.body["scroll" + o],
                                              r["scroll" + o],
                                              t.body["offset" + o],
                                              r["offset" + o],
                                              r["client" + o]
                                          ))
                                        : void 0 === n
                                        ? C.css(t, e, i)
                                        : C.style(t, e, n, i)
                                },
                                s,
                                n ? t : void 0,
                                n,
                                null
                            )
                        }
                    }
                )
            }),
            (C.fn.size = function () {
                return this.length
            }),
            (C.fn.andSelf = C.fn.addBack),
            "function" == typeof define &&
                define.amd &&
                define("jquery", [], function () {
                    return C
                })
        var Re = f.jQuery,
            Le = f.$
        return (
            (C.noConflict = function (t) {
                return (
                    f.$ === C && (f.$ = Le),
                    t && f.jQuery === C && (f.jQuery = Re),
                    C
                )
            }),
            typeof t == z && (f.jQuery = f.$ = C),
            C
        )
    }),
    (function (t, e) {
        "function" == typeof define && define.amd
            ? define([], function () {
                  return (t.svg4everybody = e())
              })
            : "object" == typeof exports
            ? (module.exports = e())
            : (t.svg4everybody = e())
    })(this, function () {
        function d(t, e) {
            if (e) {
                var n = !t.getAttribute("viewBox") && e.getAttribute("viewBox"),
                    r = document.createDocumentFragment(),
                    i = e.cloneNode(!0)
                for (n && t.setAttribute("viewBox", n); i.childNodes.length; )
                    r.appendChild(i.firstChild)
                t.appendChild(r)
            }
        }
        return function (t) {
            t = t || {}
            var l = document.getElementsByTagName("use"),
                c =
                    "polyfill" in t
                        ? t.polyfill
                        : /\bEdge\/12\b|\bTrident\/[567]\b|\bVersion\/7.0 Safari\b/.test(
                              navigator.userAgent
                          ) ||
                          (navigator.userAgent.match(/AppleWebKit\/(\d+)/) ||
                              [])[1] < 537,
                u = t.validate,
                p = window.requestAnimationFrame || setTimeout,
                h = {}
            c &&
                (function t() {
                    for (var e; (e = l[0]); ) {
                        var n,
                            r,
                            i,
                            o,
                            s,
                            a = e.parentNode
                        a &&
                            /svg/i.test(a.nodeName) &&
                            ((n = e.getAttribute("xlink:href")),
                            !c ||
                                (u && !u(n, a, e)) ||
                                ((i = (r = n.split("#"))[0]),
                                (o = r[1]),
                                a.removeChild(e),
                                i.length
                                    ? ((s = h[i] = h[i] || new XMLHttpRequest())
                                          .s ||
                                          ((s.s = []),
                                          s.open("GET", i),
                                          s.send()),
                                      s.s.push([a, o]),
                                      (function (t) {
                                          ;(t.onreadystatechange = function () {
                                              var e
                                              4 === t.readyState &&
                                                  (((e =
                                                      document.createElement(
                                                          "x"
                                                      )).innerHTML =
                                                      t.responseText),
                                                  t.s
                                                      .splice(0)
                                                      .map(function (t) {
                                                          d(
                                                              t[0],
                                                              e.querySelector(
                                                                  "#" +
                                                                      t[1].replace(
                                                                          /(\W)/g,
                                                                          "\\$1"
                                                                      )
                                                              )
                                                          )
                                                      }))
                                          }),
                                              t.onreadystatechange()
                                      })(s))
                                    : d(a, document.getElementById(o))))
                    }
                    p(t, 17)
                })()
        }
    }),
    "undefined" == typeof jQuery)
)
    throw new Error("Bootstrap's JavaScript requires jQuery")
!(function () {
    "use strict"
    var t = jQuery.fn.jquery.split(" ")[0].split(".")
    if ((t[0] < 2 && t[1] < 9) || (1 == t[0] && 9 == t[1] && t[2] < 1))
        throw new Error(
            "Bootstrap's JavaScript requires jQuery version 1.9.1 or higher"
        )
})(),
    (function (r) {
        "use strict"
        ;(r.fn.emulateTransitionEnd = function (t) {
            var e = !1,
                n = this
            r(this).one("bsTransitionEnd", function () {
                e = !0
            })
            return (
                setTimeout(function () {
                    e || r(n).trigger(r.support.transition.end)
                }, t),
                this
            )
        }),
            r(function () {
                ;(r.support.transition = (function () {
                    var t = document.createElement("bootstrap"),
                        e = {
                            WebkitTransition: "webkitTransitionEnd",
                            MozTransition: "transitionend",
                            OTransition: "oTransitionEnd otransitionend",
                            transition: "transitionend",
                        }
                    for (var n in e)
                        if (void 0 !== t.style[n]) return { end: e[n] }
                    return !1
                })()),
                    r.support.transition &&
                        (r.event.special.bsTransitionEnd = {
                            bindType: r.support.transition.end,
                            delegateType: r.support.transition.end,
                            handle: function (t) {
                                if (r(t.target).is(this))
                                    return t.handleObj.handler.apply(
                                        this,
                                        arguments
                                    )
                            },
                        })
            })
    })(jQuery),
    (function (o) {
        "use strict"
        function s(t) {
            o(t).on("click", e, this.close)
        }
        var e = '[data-dismiss="alert"]'
        ;(s.VERSION = "3.3.2"),
            (s.TRANSITION_DURATION = 150),
            (s.prototype.close = function (t) {
                var e = o(this),
                    n =
                        (n = e.attr("data-target")) ||
                        ((n = e.attr("href")) &&
                            n.replace(/.*(?=#[^\s]*$)/, "")),
                    r = o(n)
                function i() {
                    r.detach().trigger("closed.bs.alert").remove()
                }
                t && t.preventDefault(),
                    r.length || (r = e.closest(".alert")),
                    r.trigger((t = o.Event("close.bs.alert"))),
                    t.isDefaultPrevented() ||
                        (r.removeClass("in"),
                        o.support.transition && r.hasClass("fade")
                            ? r
                                  .one("bsTransitionEnd", i)
                                  .emulateTransitionEnd(s.TRANSITION_DURATION)
                            : i())
            })
        var t = o.fn.alert
        ;(o.fn.alert = function (n) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.alert")
                e || t.data("bs.alert", (e = new s(this))),
                    "string" == typeof n && e[n].call(t)
            })
        }),
            (o.fn.alert.Constructor = s),
            (o.fn.alert.noConflict = function () {
                return (o.fn.alert = t), this
            }),
            o(document).on("click.bs.alert.data-api", e, s.prototype.close)
    })(jQuery),
    (function (o) {
        "use strict"
        var i = function (t, e) {
            ;(this.$element = o(t)),
                (this.options = o.extend({}, i.DEFAULTS, e)),
                (this.isLoading = !1)
        }
        function n(r) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.button"),
                    n = "object" == typeof r && r
                e || t.data("bs.button", (e = new i(this, n))),
                    "toggle" == r ? e.toggle() : r && e.setState(r)
            })
        }
        ;(i.VERSION = "3.3.2"),
            (i.DEFAULTS = { loadingText: "loading..." }),
            (i.prototype.setState = function (t) {
                var e = "disabled",
                    n = this.$element,
                    r = n.is("input") ? "val" : "html",
                    i = n.data()
                ;(t += "Text"),
                    null == i.resetText && n.data("resetText", n[r]()),
                    setTimeout(
                        o.proxy(function () {
                            n[r](null == i[t] ? this.options[t] : i[t]),
                                "loadingText" == t
                                    ? ((this.isLoading = !0),
                                      n.addClass(e).attr(e, e))
                                    : this.isLoading &&
                                      ((this.isLoading = !1),
                                      n.removeClass(e).removeAttr(e))
                        }, this),
                        0
                    )
            }),
            (i.prototype.toggle = function () {
                var t,
                    e = !0,
                    n = this.$element.closest('[data-toggle="buttons"]')
                n.length
                    ? ("radio" ==
                          (t = this.$element.find("input")).prop("type") &&
                          (t.prop("checked") && this.$element.hasClass("active")
                              ? (e = !1)
                              : n.find(".active").removeClass("active")),
                      e &&
                          t
                              .prop(
                                  "checked",
                                  !this.$element.hasClass("active")
                              )
                              .trigger("change"))
                    : this.$element.attr(
                          "aria-pressed",
                          !this.$element.hasClass("active")
                      ),
                    e && this.$element.toggleClass("active")
            })
        var t = o.fn.button
        ;(o.fn.button = n),
            (o.fn.button.Constructor = i),
            (o.fn.button.noConflict = function () {
                return (o.fn.button = t), this
            }),
            o(document)
                .on(
                    "click.bs.button.data-api",
                    '[data-toggle^="button"]',
                    function (t) {
                        var e = o(t.target)
                        e.hasClass("btn") || (e = e.closest(".btn")),
                            n.call(e, "toggle"),
                            t.preventDefault()
                    }
                )
                .on(
                    "focus.bs.button.data-api blur.bs.button.data-api",
                    '[data-toggle^="button"]',
                    function (t) {
                        o(t.target)
                            .closest(".btn")
                            .toggleClass("focus", /^focus(in)?$/.test(t.type))
                    }
                )
    })(jQuery),
    (function (p) {
        "use strict"
        function h(t, e) {
            ;(this.$element = p(t)),
                (this.$indicators = this.$element.find(".carousel-indicators")),
                (this.options = e),
                (this.paused =
                    this.sliding =
                    this.interval =
                    this.$active =
                    this.$items =
                        null),
                this.options.keyboard &&
                    this.$element.on(
                        "keydown.bs.carousel",
                        p.proxy(this.keydown, this)
                    ),
                "hover" != this.options.pause ||
                    "ontouchstart" in document.documentElement ||
                    this.$element
                        .on("mouseenter.bs.carousel", p.proxy(this.pause, this))
                        .on("mouseleave.bs.carousel", p.proxy(this.cycle, this))
        }
        function s(i) {
            return this.each(function () {
                var t = p(this),
                    e = t.data("bs.carousel"),
                    n = p.extend(
                        {},
                        h.DEFAULTS,
                        t.data(),
                        "object" == typeof i && i
                    ),
                    r = "string" == typeof i ? i : n.slide
                e || t.data("bs.carousel", (e = new h(this, n))),
                    "number" == typeof i
                        ? e.to(i)
                        : r
                        ? e[r]()
                        : n.interval && e.pause().cycle()
            })
        }
        ;(h.VERSION = "3.3.2"),
            (h.TRANSITION_DURATION = 600),
            (h.DEFAULTS = {
                interval: 5e3,
                pause: "hover",
                wrap: !0,
                keyboard: !0,
            }),
            (h.prototype.keydown = function (t) {
                if (!/input|textarea/i.test(t.target.tagName)) {
                    switch (t.which) {
                        case 37:
                            this.prev()
                            break
                        case 39:
                            this.next()
                            break
                        default:
                            return
                    }
                    t.preventDefault()
                }
            }),
            (h.prototype.cycle = function (t) {
                return (
                    t || (this.paused = !1),
                    this.interval && clearInterval(this.interval),
                    this.options.interval &&
                        !this.paused &&
                        (this.interval = setInterval(
                            p.proxy(this.next, this),
                            this.options.interval
                        )),
                    this
                )
            }),
            (h.prototype.getItemIndex = function (t) {
                return (
                    (this.$items = t.parent().children(".item")),
                    this.$items.index(t || this.$active)
                )
            }),
            (h.prototype.getItemForDirection = function (t, e) {
                var n = this.getItemIndex(e)
                if (
                    (("prev" == t && 0 === n) ||
                        ("next" == t && n == this.$items.length - 1)) &&
                    !this.options.wrap
                )
                    return e
                var r = (n + ("prev" == t ? -1 : 1)) % this.$items.length
                return this.$items.eq(r)
            }),
            (h.prototype.to = function (t) {
                var e = this,
                    n = this.getItemIndex(
                        (this.$active = this.$element.find(".item.active"))
                    )
                if (!(t > this.$items.length - 1 || t < 0))
                    return this.sliding
                        ? this.$element.one("slid.bs.carousel", function () {
                              e.to(t)
                          })
                        : n == t
                        ? this.pause().cycle()
                        : this.slide(n < t ? "next" : "prev", this.$items.eq(t))
            }),
            (h.prototype.pause = function (t) {
                return (
                    t || (this.paused = !0),
                    this.$element.find(".next, .prev").length &&
                        p.support.transition &&
                        (this.$element.trigger(p.support.transition.end),
                        this.cycle(!0)),
                    (this.interval = clearInterval(this.interval)),
                    this
                )
            }),
            (h.prototype.next = function () {
                if (!this.sliding) return this.slide("next")
            }),
            (h.prototype.prev = function () {
                if (!this.sliding) return this.slide("prev")
            }),
            (h.prototype.slide = function (t, e) {
                var n = this.$element.find(".item.active"),
                    r = e || this.getItemForDirection(t, n),
                    i = this.interval,
                    o = "next" == t ? "left" : "right",
                    s = this
                if (r.hasClass("active")) return (this.sliding = !1)
                var a,
                    l = r[0],
                    c = p.Event("slide.bs.carousel", {
                        relatedTarget: l,
                        direction: o,
                    })
                if ((this.$element.trigger(c), !c.isDefaultPrevented())) {
                    ;(this.sliding = !0),
                        i && this.pause(),
                        this.$indicators.length &&
                            (this.$indicators
                                .find(".active")
                                .removeClass("active"),
                            (a = p(
                                this.$indicators.children()[
                                    this.getItemIndex(r)
                                ]
                            )) && a.addClass("active"))
                    var u = p.Event("slid.bs.carousel", {
                        relatedTarget: l,
                        direction: o,
                    })
                    return (
                        p.support.transition && this.$element.hasClass("slide")
                            ? (r.addClass(t),
                              r[0].offsetWidth,
                              n.addClass(o),
                              r.addClass(o),
                              n
                                  .one("bsTransitionEnd", function () {
                                      r
                                          .removeClass([t, o].join(" "))
                                          .addClass("active"),
                                          n.removeClass(
                                              ["active", o].join(" ")
                                          ),
                                          (s.sliding = !1),
                                          setTimeout(function () {
                                              s.$element.trigger(u)
                                          }, 0)
                                  })
                                  .emulateTransitionEnd(h.TRANSITION_DURATION))
                            : (n.removeClass("active"),
                              r.addClass("active"),
                              (this.sliding = !1),
                              this.$element.trigger(u)),
                        i && this.cycle(),
                        this
                    )
                }
            })
        var t = p.fn.carousel
        ;(p.fn.carousel = s),
            (p.fn.carousel.Constructor = h),
            (p.fn.carousel.noConflict = function () {
                return (p.fn.carousel = t), this
            })
        function e(t) {
            var e,
                n,
                r,
                i = p(this),
                o = p(
                    i.attr("data-target") ||
                        ((e = i.attr("href")) &&
                            e.replace(/.*(?=#[^\s]+$)/, ""))
                )
            o.hasClass("carousel") &&
                ((n = p.extend({}, o.data(), i.data())),
                (r = i.attr("data-slide-to")) && (n.interval = !1),
                s.call(o, n),
                r && o.data("bs.carousel").to(r),
                t.preventDefault())
        }
        p(document)
            .on("click.bs.carousel.data-api", "[data-slide]", e)
            .on("click.bs.carousel.data-api", "[data-slide-to]", e),
            p(window).on("load", function () {
                p('[data-ride="carousel"]').each(function () {
                    var t = p(this)
                    s.call(t, t.data())
                })
            })
    })(jQuery),
    (function (s) {
        "use strict"
        var a = function (t, e) {
            ;(this.$element = s(t)),
                (this.options = s.extend({}, a.DEFAULTS, e)),
                (this.$trigger = s(this.options.trigger).filter(
                    '[href="#' + t.id + '"], [data-target="#' + t.id + '"]'
                )),
                (this.transitioning = null),
                this.options.parent
                    ? (this.$parent = this.getParent())
                    : this.addAriaAndCollapsedClass(
                          this.$element,
                          this.$trigger
                      ),
                this.options.toggle && this.toggle()
        }
        function i(t) {
            var e,
                n =
                    t.attr("data-target") ||
                    ((e = t.attr("href")) && e.replace(/.*(?=#[^\s]+$)/, ""))
            return s(n)
        }
        function l(r) {
            return this.each(function () {
                var t = s(this),
                    e = t.data("bs.collapse"),
                    n = s.extend(
                        {},
                        a.DEFAULTS,
                        t.data(),
                        "object" == typeof r && r
                    )
                !e && n.toggle && "show" == r && (n.toggle = !1),
                    e || t.data("bs.collapse", (e = new a(this, n))),
                    "string" == typeof r && e[r]()
            })
        }
        ;(a.VERSION = "3.3.2"),
            (a.TRANSITION_DURATION = 350),
            (a.DEFAULTS = { toggle: !0, trigger: '[data-toggle="collapse"]' }),
            (a.prototype.dimension = function () {
                return this.$element.hasClass("width") ? "width" : "height"
            }),
            (a.prototype.show = function () {
                if (!this.transitioning && !this.$element.hasClass("in")) {
                    var t,
                        e =
                            this.$parent &&
                            this.$parent
                                .children(".panel")
                                .children(".in, .collapsing")
                    if (
                        !(
                            e &&
                            e.length &&
                            (t = e.data("bs.collapse")) &&
                            t.transitioning
                        )
                    ) {
                        var n = s.Event("show.bs.collapse")
                        if (
                            (this.$element.trigger(n), !n.isDefaultPrevented())
                        ) {
                            e &&
                                e.length &&
                                (l.call(e, "hide"),
                                t || e.data("bs.collapse", null))
                            var r = this.dimension()
                            this.$element
                                .removeClass("collapse")
                                .addClass("collapsing")
                                [r](0)
                                .attr("data-expanded", !0),
                                this.$trigger
                                    .removeClass("collapsed")
                                    .attr("data-expanded", !0),
                                (this.transitioning = 1)
                            var i = function () {
                                this.$element
                                    .removeClass("collapsing")
                                    .addClass("collapse in")
                                    [r](""),
                                    (this.transitioning = 0),
                                    this.$element.trigger("shown.bs.collapse")
                            }
                            if (!s.support.transition) return i.call(this)
                            var o = s.camelCase(["scroll", r].join("-"))
                            this.$element
                                .one("bsTransitionEnd", s.proxy(i, this))
                                .emulateTransitionEnd(a.TRANSITION_DURATION)
                                [r](this.$element[0][o])
                        }
                    }
                }
            }),
            (a.prototype.hide = function () {
                if (!this.transitioning && this.$element.hasClass("in")) {
                    var t = s.Event("hide.bs.collapse")
                    if ((this.$element.trigger(t), !t.isDefaultPrevented())) {
                        var e = this.dimension()
                        this.$element[e](this.$element[e]())[0].offsetHeight,
                            this.$element
                                .addClass("collapsing")
                                .removeClass("collapse in")
                                .attr("data-expanded", !1),
                            this.$trigger
                                .addClass("collapsed")
                                .attr("data-expanded", !1),
                            (this.transitioning = 1)
                        var n = function () {
                            ;(this.transitioning = 0),
                                this.$element
                                    .removeClass("collapsing")
                                    .addClass("collapse")
                                    .trigger("hidden.bs.collapse")
                        }
                        if (!s.support.transition) return n.call(this)
                        this.$element[e](0)
                            .one("bsTransitionEnd", s.proxy(n, this))
                            .emulateTransitionEnd(a.TRANSITION_DURATION)
                    }
                }
            }),
            (a.prototype.toggle = function () {
                this[this.$element.hasClass("in") ? "hide" : "show"]()
            }),
            (a.prototype.getParent = function () {
                return s(this.options.parent)
                    .find(
                        '[data-toggle="collapse"][data-parent="' +
                            this.options.parent +
                            '"]'
                    )
                    .each(
                        s.proxy(function (t, e) {
                            var n = s(e)
                            this.addAriaAndCollapsedClass(i(n), n)
                        }, this)
                    )
                    .end()
            }),
            (a.prototype.addAriaAndCollapsedClass = function (t, e) {
                var n = t.hasClass("in")
                t.attr("data-expanded", n),
                    e.toggleClass("collapsed", !n).attr("data-expanded", n)
            })
        var t = s.fn.collapse
        ;(s.fn.collapse = l),
            (s.fn.collapse.Constructor = a),
            (s.fn.collapse.noConflict = function () {
                return (s.fn.collapse = t), this
            }),
            s(document).on(
                "click.bs.collapse.data-api",
                '[data-toggle="collapse"]',
                function (t) {
                    var e = s(this)
                    e.attr("data-target") || t.preventDefault()
                    var n = i(e),
                        r = n.data("bs.collapse")
                            ? "toggle"
                            : s.extend({}, e.data(), { trigger: this })
                    l.call(n, r)
                }
            )
    })(jQuery),
    (function (a) {
        "use strict"
        function r(t) {
            a(t).on("click.bs.dropdown", this.toggle)
        }
        var l = '[data-toggle="dropdown"]'
        function o(r) {
            ;(r && 3 === r.which) ||
                (a(".dropdown-backdrop").remove(),
                a(l).each(function () {
                    var t = a(this),
                        e = c(t),
                        n = { relatedTarget: this }
                    e.hasClass("open") &&
                        (e.trigger((r = a.Event("hide.bs.dropdown", n))),
                        r.isDefaultPrevented() ||
                            (t.attr("aria-expanded", "false"),
                            e
                                .removeClass("open")
                                .trigger("hidden.bs.dropdown", n)))
                }))
        }
        function c(t) {
            var e = t.attr("data-target"),
                n =
                    (e =
                        e ||
                        ((e = t.attr("href")) &&
                            /#[A-Za-z]/.test(e) &&
                            e.replace(/.*(?=#[^\s]*$)/, ""))) && a(e)
            return n && n.length ? n : t.parent()
        }
        ;(r.VERSION = "3.3.2"),
            (r.prototype.toggle = function (t) {
                var e = a(this)
                if (!e.is(".disabled, :disabled")) {
                    var n = c(e),
                        r = n.hasClass("open")
                    if ((o(), !r)) {
                        "ontouchstart" in document.documentElement &&
                            !n.closest(".navbar-nav").length &&
                            a('<div class="dropdown-backdrop"/>')
                                .insertAfter(a(this))
                                .on("click", o)
                        var i = { relatedTarget: this }
                        if (
                            (n.trigger((t = a.Event("show.bs.dropdown", i))),
                            t.isDefaultPrevented())
                        )
                            return
                        e.trigger("focus").attr("aria-expanded", "true"),
                            n
                                .toggleClass("open")
                                .trigger("shown.bs.dropdown", i)
                    }
                    return !1
                }
            }),
            (r.prototype.keydown = function (t) {
                if (
                    /(38|40|27|32)/.test(t.which) &&
                    !/input|textarea/i.test(t.target.tagName)
                ) {
                    var e = a(this)
                    if (
                        (t.preventDefault(),
                        t.stopPropagation(),
                        !e.is(".disabled, :disabled"))
                    ) {
                        var n = c(e),
                            r = n.hasClass("open")
                        if ((!r && 27 != t.which) || (r && 27 == t.which))
                            return (
                                27 == t.which && n.find(l).trigger("focus"),
                                e.trigger("click")
                            )
                        var i,
                            o = " li:not(.divider):visible a",
                            s = n.find(
                                '[role="menu"]' + o + ', [role="listbox"]' + o
                            )
                        s.length &&
                            ((i = s.index(t.target)),
                            38 == t.which && 0 < i && i--,
                            40 == t.which && i < s.length - 1 && i++,
                            ~i || (i = 0),
                            s.eq(i).trigger("focus"))
                    }
                }
            })
        var t = a.fn.dropdown
        ;(a.fn.dropdown = function (n) {
            return this.each(function () {
                var t = a(this),
                    e = t.data("bs.dropdown")
                e || t.data("bs.dropdown", (e = new r(this))),
                    "string" == typeof n && e[n].call(t)
            })
        }),
            (a.fn.dropdown.Constructor = r),
            (a.fn.dropdown.noConflict = function () {
                return (a.fn.dropdown = t), this
            }),
            a(document)
                .on("click.bs.dropdown.data-api", o)
                .on(
                    "click.bs.dropdown.data-api",
                    ".dropdown form",
                    function (t) {
                        t.stopPropagation()
                    }
                )
                .on("click.bs.dropdown.data-api", l, r.prototype.toggle)
                .on("keydown.bs.dropdown.data-api", l, r.prototype.keydown)
                .on(
                    "keydown.bs.dropdown.data-api",
                    '[role="menu"]',
                    r.prototype.keydown
                )
                .on(
                    "keydown.bs.dropdown.data-api",
                    '[role="listbox"]',
                    r.prototype.keydown
                )
    })(jQuery),
    (function (o) {
        "use strict"
        function s(t, e) {
            ;(this.options = e),
                (this.$body = o(document.body)),
                (this.$element = o(t)),
                (this.$backdrop = this.isShown = null),
                (this.scrollbarWidth = 0),
                this.options.remote &&
                    this.$element.find(".modal-content").load(
                        this.options.remote,
                        o.proxy(function () {
                            this.$element.trigger("loaded.bs.modal")
                        }, this)
                    )
        }
        function a(r, i) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.modal"),
                    n = o.extend(
                        {},
                        s.DEFAULTS,
                        t.data(),
                        "object" == typeof r && r
                    )
                e || t.data("bs.modal", (e = new s(this, n))),
                    "string" == typeof r ? e[r](i) : n.show && e.show(i)
            })
        }
        ;(s.VERSION = "3.3.2"),
            (s.TRANSITION_DURATION = 300),
            (s.BACKDROP_TRANSITION_DURATION = 150),
            (s.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 }),
            (s.prototype.toggle = function (t) {
                return this.isShown ? this.hide() : this.show(t)
            }),
            (s.prototype.show = function (n) {
                var r = this,
                    t = o.Event("show.bs.modal", { relatedTarget: n })
                this.$element.trigger(t),
                    this.isShown ||
                        t.isDefaultPrevented() ||
                        ((this.isShown = !0),
                        this.checkScrollbar(),
                        this.setScrollbar(),
                        this.$body.addClass("modal-open"),
                        this.escape(),
                        this.resize(),
                        this.$element.on(
                            "click.dismiss.bs.modal",
                            '[data-dismiss="modal"]',
                            o.proxy(this.hide, this)
                        ),
                        this.backdrop(function () {
                            var t =
                                o.support.transition &&
                                r.$element.hasClass("fade")
                            r.$element.parent().length ||
                                r.$element.appendTo(r.$body),
                                r.$element.show().scrollTop(0),
                                r.options.backdrop && r.adjustBackdrop(),
                                r.adjustDialog(),
                                t && r.$element[0].offsetWidth,
                                r.$element
                                    .addClass("in")
                                    .attr("aria-hidden", !1),
                                r.enforceFocus()
                            var e = o.Event("shown.bs.modal", {
                                relatedTarget: n,
                            })
                            t
                                ? r.$element
                                      .find(".modal-dialog")
                                      .one("bsTransitionEnd", function () {
                                          r.$element.trigger("focus").trigger(e)
                                      })
                                      .emulateTransitionEnd(
                                          s.TRANSITION_DURATION
                                      )
                                : r.$element.trigger("focus").trigger(e)
                        }))
            }),
            (s.prototype.hide = function (t) {
                t && t.preventDefault(),
                    (t = o.Event("hide.bs.modal")),
                    this.$element.trigger(t),
                    this.isShown &&
                        !t.isDefaultPrevented() &&
                        ((this.isShown = !1),
                        this.escape(),
                        this.resize(),
                        o(document).off("focusin.bs.modal"),
                        this.$element
                            .removeClass("in")
                            .attr("aria-hidden", !0)
                            .off("click.dismiss.bs.modal"),
                        o.support.transition && this.$element.hasClass("fade")
                            ? this.$element
                                  .one(
                                      "bsTransitionEnd",
                                      o.proxy(this.hideModal, this)
                                  )
                                  .emulateTransitionEnd(s.TRANSITION_DURATION)
                            : this.hideModal())
            }),
            (s.prototype.enforceFocus = function () {
                o(document)
                    .off("focusin.bs.modal")
                    .on(
                        "focusin.bs.modal",
                        o.proxy(function (t) {
                            this.$element[0] === t.target ||
                                this.$element.has(t.target).length ||
                                this.$element.trigger("focus")
                        }, this)
                    )
            }),
            (s.prototype.escape = function () {
                this.isShown && this.options.keyboard
                    ? this.$element.on(
                          "keydown.dismiss.bs.modal",
                          o.proxy(function (t) {
                              27 == t.which && this.hide()
                          }, this)
                      )
                    : this.isShown ||
                      this.$element.off("keydown.dismiss.bs.modal")
            }),
            (s.prototype.resize = function () {
                this.isShown
                    ? o(window).on(
                          "resize.bs.modal",
                          o.proxy(this.handleUpdate, this)
                      )
                    : o(window).off("resize.bs.modal")
            }),
            (s.prototype.hideModal = function () {
                var t = this
                this.$element.hide(),
                    this.backdrop(function () {
                        t.$body.removeClass("modal-open"),
                            t.resetAdjustments(),
                            t.resetScrollbar(),
                            t.$element.trigger("hidden.bs.modal")
                    })
            }),
            (s.prototype.removeBackdrop = function () {
                this.$backdrop && this.$backdrop.remove(),
                    (this.$backdrop = null)
            }),
            (s.prototype.backdrop = function (t) {
                var e,
                    n = this,
                    r = this.$element.hasClass("fade") ? "fade" : ""
                if (this.isShown && this.options.backdrop) {
                    var i = o.support.transition && r
                    if (
                        ((this.$backdrop = o(
                            '<div class="modal-backdrop ' + r + '" />'
                        )
                            .prependTo(this.$element)
                            .on(
                                "click.dismiss.bs.modal",
                                o.proxy(function (t) {
                                    t.target === t.currentTarget &&
                                        ("static" == this.options.backdrop
                                            ? this.$element[0].focus.call(
                                                  this.$element[0]
                                              )
                                            : this.hide.call(this))
                                }, this)
                            )),
                        i && this.$backdrop[0].offsetWidth,
                        this.$backdrop.addClass("in"),
                        !t)
                    )
                        return
                    i
                        ? this.$backdrop
                              .one("bsTransitionEnd", t)
                              .emulateTransitionEnd(
                                  s.BACKDROP_TRANSITION_DURATION
                              )
                        : t()
                } else {
                    !this.isShown && this.$backdrop
                        ? (this.$backdrop.removeClass("in"),
                          (e = function () {
                              n.removeBackdrop(), t && t()
                          }),
                          o.support.transition && this.$element.hasClass("fade")
                              ? this.$backdrop
                                    .one("bsTransitionEnd", e)
                                    .emulateTransitionEnd(
                                        s.BACKDROP_TRANSITION_DURATION
                                    )
                              : e())
                        : t && t()
                }
            }),
            (s.prototype.handleUpdate = function () {
                this.options.backdrop && this.adjustBackdrop(),
                    this.adjustDialog()
            }),
            (s.prototype.adjustBackdrop = function () {
                this.$backdrop
                    .css("height", 0)
                    .css("height", this.$element[0].scrollHeight)
            }),
            (s.prototype.adjustDialog = function () {
                var t =
                    this.$element[0].scrollHeight >
                    document.documentElement.clientHeight
                this.$element.css({
                    paddingLeft:
                        !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
                    paddingRight:
                        this.bodyIsOverflowing && !t ? this.scrollbarWidth : "",
                })
            }),
            (s.prototype.resetAdjustments = function () {
                this.$element.css({ paddingLeft: "", paddingRight: "" })
            }),
            (s.prototype.checkScrollbar = function () {
                ;(this.bodyIsOverflowing =
                    document.body.scrollHeight >
                    document.documentElement.clientHeight),
                    (this.scrollbarWidth = this.measureScrollbar())
            }),
            (s.prototype.setScrollbar = function () {
                var t = parseInt(this.$body.css("padding-right") || 0, 10)
                this.bodyIsOverflowing &&
                    this.$body.css("padding-right", t + this.scrollbarWidth)
            }),
            (s.prototype.resetScrollbar = function () {
                this.$body.css("padding-right", "")
            }),
            (s.prototype.measureScrollbar = function () {
                var t = document.createElement("div")
                ;(t.className = "modal-scrollbar-measure"), this.$body.append(t)
                var e = t.offsetWidth - t.clientWidth
                return this.$body[0].removeChild(t), e
            })
        var t = o.fn.modal
        ;(o.fn.modal = a),
            (o.fn.modal.Constructor = s),
            (o.fn.modal.noConflict = function () {
                return (o.fn.modal = t), this
            }),
            o(document).on(
                "click.bs.modal.data-api",
                '[data-toggle="modal"]',
                function (t) {
                    var e = o(this),
                        n = e.attr("href"),
                        r = o(
                            e.attr("data-target") ||
                                (n && n.replace(/.*(?=#[^\s]+$)/, ""))
                        ),
                        i = r.data("bs.modal")
                            ? "toggle"
                            : o.extend(
                                  { remote: !/#/.test(n) && n },
                                  r.data(),
                                  e.data()
                              )
                    e.is("a") && t.preventDefault(),
                        r.one("show.bs.modal", function (t) {
                            t.isDefaultPrevented() ||
                                r.one("hidden.bs.modal", function () {
                                    e.is(":visible") && e.trigger("focus")
                                })
                        }),
                        a.call(r, i, this)
                }
            )
    })(jQuery),
    (function (m) {
        "use strict"
        function v(t, e) {
            ;(this.type =
                this.options =
                this.enabled =
                this.timeout =
                this.hoverState =
                this.$element =
                    null),
                this.init("tooltip", t, e)
        }
        ;(v.VERSION = "3.3.2"),
            (v.TRANSITION_DURATION = 150),
            (v.DEFAULTS = {
                animation: !0,
                placement: "top",
                selector: !1,
                template:
                    '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: "hover focus",
                title: "",
                delay: 0,
                html: !1,
                container: !1,
                viewport: { selector: "body", padding: 0 },
            }),
            (v.prototype.init = function (t, e, n) {
                ;(this.enabled = !0),
                    (this.type = t),
                    (this.$element = m(e)),
                    (this.options = this.getOptions(n)),
                    (this.$viewport =
                        this.options.viewport &&
                        m(
                            this.options.viewport.selector ||
                                this.options.viewport
                        ))
                for (
                    var r = this.options.trigger.split(" "), i = r.length;
                    i--;

                ) {
                    var o,
                        s,
                        a = r[i]
                    "click" == a
                        ? this.$element.on(
                              "click." + this.type,
                              this.options.selector,
                              m.proxy(this.toggle, this)
                          )
                        : "manual" != a &&
                          ((o = "hover" == a ? "mouseenter" : "focusin"),
                          (s = "hover" == a ? "mouseleave" : "focusout"),
                          this.$element.on(
                              o + "." + this.type,
                              this.options.selector,
                              m.proxy(this.enter, this)
                          ),
                          this.$element.on(
                              s + "." + this.type,
                              this.options.selector,
                              m.proxy(this.leave, this)
                          ))
                }
                this.options.selector
                    ? (this._options = m.extend({}, this.options, {
                          trigger: "manual",
                          selector: "",
                      }))
                    : this.fixTitle()
            }),
            (v.prototype.getDefaults = function () {
                return v.DEFAULTS
            }),
            (v.prototype.getOptions = function (t) {
                return (
                    (t = m.extend(
                        {},
                        this.getDefaults(),
                        this.$element.data(),
                        t
                    )).delay &&
                        "number" == typeof t.delay &&
                        (t.delay = { show: t.delay, hide: t.delay }),
                    t
                )
            }),
            (v.prototype.getDelegateOptions = function () {
                var n = {},
                    r = this.getDefaults()
                return (
                    this._options &&
                        m.each(this._options, function (t, e) {
                            r[t] != e && (n[t] = e)
                        }),
                    n
                )
            }),
            (v.prototype.enter = function (t) {
                var e =
                    t instanceof this.constructor
                        ? t
                        : m(t.currentTarget).data("bs." + this.type)
                if (e && e.$tip && e.$tip.is(":visible")) e.hoverState = "in"
                else {
                    if (
                        (e ||
                            ((e = new this.constructor(
                                t.currentTarget,
                                this.getDelegateOptions()
                            )),
                            m(t.currentTarget).data("bs." + this.type, e)),
                        clearTimeout(e.timeout),
                        (e.hoverState = "in"),
                        !e.options.delay || !e.options.delay.show)
                    )
                        return e.show()
                    e.timeout = setTimeout(function () {
                        "in" == e.hoverState && e.show()
                    }, e.options.delay.show)
                }
            }),
            (v.prototype.leave = function (t) {
                var e =
                    t instanceof this.constructor
                        ? t
                        : m(t.currentTarget).data("bs." + this.type)
                if (
                    (e ||
                        ((e = new this.constructor(
                            t.currentTarget,
                            this.getDelegateOptions()
                        )),
                        m(t.currentTarget).data("bs." + this.type, e)),
                    clearTimeout(e.timeout),
                    (e.hoverState = "out"),
                    !e.options.delay || !e.options.delay.hide)
                )
                    return e.hide()
                e.timeout = setTimeout(function () {
                    "out" == e.hoverState && e.hide()
                }, e.options.delay.hide)
            }),
            (v.prototype.show = function () {
                var t = m.Event("show.bs." + this.type)
                if (this.hasContent() && this.enabled) {
                    this.$element.trigger(t)
                    var e = m.contains(
                        this.$element[0].ownerDocument.documentElement,
                        this.$element[0]
                    )
                    if (t.isDefaultPrevented() || !e) return
                    var n = this,
                        r = this.tip(),
                        i = this.getUID(this.type)
                    this.setContent(),
                        r.attr("id", i),
                        this.$element.attr("aria-describedby", i),
                        this.options.animation && r.addClass("fade")
                    var o =
                            "function" == typeof this.options.placement
                                ? this.options.placement.call(
                                      this,
                                      r[0],
                                      this.$element[0]
                                  )
                                : this.options.placement,
                        s = /\s?auto?\s?/i,
                        a = s.test(o)
                    a && (o = o.replace(s, "") || "top"),
                        r
                            .detach()
                            .css({ top: 0, left: 0, display: "block" })
                            .addClass(o)
                            .data("bs." + this.type, this),
                        this.options.container
                            ? r.appendTo(this.options.container)
                            : r.insertAfter(this.$element)
                    var l,
                        c,
                        u,
                        p = this.getPosition(),
                        h = r[0].offsetWidth,
                        d = r[0].offsetHeight
                    a &&
                        ((l = o),
                        (c = this.options.container
                            ? m(this.options.container)
                            : this.$element.parent()),
                        (u = this.getPosition(c)),
                        (o =
                            "bottom" == o && p.bottom + d > u.bottom
                                ? "top"
                                : "top" == o && p.top - d < u.top
                                ? "bottom"
                                : "right" == o && p.right + h > u.width
                                ? "left"
                                : "left" == o && p.left - h < u.left
                                ? "right"
                                : o),
                        r.removeClass(l).addClass(o))
                    var f = this.getCalculatedOffset(o, p, h, d)
                    this.applyPlacement(f, o)
                    var g = function () {
                        var t = n.hoverState
                        n.$element.trigger("shown.bs." + n.type),
                            (n.hoverState = null),
                            "out" == t && n.leave(n)
                    }
                    m.support.transition && this.$tip.hasClass("fade")
                        ? r
                              .one("bsTransitionEnd", g)
                              .emulateTransitionEnd(v.TRANSITION_DURATION)
                        : g()
                }
            }),
            (v.prototype.applyPlacement = function (t, e) {
                var n = this.tip(),
                    r = n[0].offsetWidth,
                    i = n[0].offsetHeight,
                    o = parseInt(n.css("margin-top"), 10),
                    s = parseInt(n.css("margin-left"), 10)
                isNaN(o) && (o = 0),
                    isNaN(s) && (s = 0),
                    (t.top = t.top + o),
                    (t.left = t.left + s),
                    m.offset.setOffset(
                        n[0],
                        m.extend(
                            {
                                using: function (t) {
                                    n.css({
                                        top: Math.round(t.top),
                                        left: Math.round(t.left),
                                    })
                                },
                            },
                            t
                        ),
                        0
                    ),
                    n.addClass("in")
                var a = n[0].offsetWidth,
                    l = n[0].offsetHeight
                "top" == e && l != i && (t.top = t.top + i - l)
                var c = this.getViewportAdjustedDelta(e, t, a, l)
                c.left ? (t.left += c.left) : (t.top += c.top)
                var u = /top|bottom/.test(e),
                    p = u ? 2 * c.left - r + a : 2 * c.top - i + l,
                    h = u ? "offsetWidth" : "offsetHeight"
                n.offset(t), this.replaceArrow(p, n[0][h], u)
            }),
            (v.prototype.replaceArrow = function (t, e, n) {
                this.arrow()
                    .css(n ? "left" : "top", 50 * (1 - t / e) + "%")
                    .css(n ? "top" : "left", "")
            }),
            (v.prototype.setContent = function () {
                var t = this.tip(),
                    e = this.getTitle()
                t
                    .find(".tooltip-inner")
                    [this.options.html ? "html" : "text"](e),
                    t.removeClass("fade in top bottom left right")
            }),
            (v.prototype.hide = function (t) {
                var e = this,
                    n = this.tip(),
                    r = m.Event("hide.bs." + this.type)
                function i() {
                    "in" != e.hoverState && n.detach(),
                        e.$element
                            .removeAttr("aria-describedby")
                            .trigger("hidden.bs." + e.type),
                        t && t()
                }
                if ((this.$element.trigger(r), !r.isDefaultPrevented()))
                    return (
                        n.removeClass("in"),
                        m.support.transition && this.$tip.hasClass("fade")
                            ? n
                                  .one("bsTransitionEnd", i)
                                  .emulateTransitionEnd(v.TRANSITION_DURATION)
                            : i(),
                        (this.hoverState = null),
                        this
                    )
            }),
            (v.prototype.fixTitle = function () {
                var t = this.$element
                ;(!t.attr("title") &&
                    "string" == typeof t.attr("data-original-title")) ||
                    t
                        .attr("data-original-title", t.attr("title") || "")
                        .attr("title", "")
            }),
            (v.prototype.hasContent = function () {
                return this.getTitle()
            }),
            (v.prototype.getPosition = function (t) {
                var e = (t = t || this.$element)[0],
                    n = "BODY" == e.tagName,
                    r = e.getBoundingClientRect()
                null == r.width &&
                    (r = m.extend({}, r, {
                        width: r.right - r.left,
                        height: r.bottom - r.top,
                    }))
                var i = n ? { top: 0, left: 0 } : t.offset(),
                    o = {
                        scroll: n
                            ? document.documentElement.scrollTop ||
                              document.body.scrollTop
                            : t.scrollTop(),
                    },
                    s = n
                        ? {
                              width: m(window).width(),
                              height: m(window).height(),
                          }
                        : null
                return m.extend({}, r, o, s, i)
            }),
            (v.prototype.getCalculatedOffset = function (t, e, n, r) {
                return "bottom" == t
                    ? {
                          top: e.top + e.height,
                          left: e.left + e.width / 2 - n / 2,
                      }
                    : "top" == t
                    ? { top: e.top - r, left: e.left + e.width / 2 - n / 2 }
                    : "left" == t
                    ? { top: e.top + e.height / 2 - r / 2, left: e.left - n }
                    : {
                          top: e.top + e.height / 2 - r / 2,
                          left: e.left + e.width,
                      }
            }),
            (v.prototype.getViewportAdjustedDelta = function (t, e, n, r) {
                var i = { top: 0, left: 0 }
                if (!this.$viewport) return i
                var o,
                    s,
                    a,
                    l,
                    c =
                        (this.options.viewport &&
                            this.options.viewport.padding) ||
                        0,
                    u = this.getPosition(this.$viewport)
                return (
                    /right|left/.test(t)
                        ? ((o = e.top - c - u.scroll),
                          (s = e.top + c - u.scroll + r),
                          o < u.top
                              ? (i.top = u.top - o)
                              : s > u.top + u.height &&
                                (i.top = u.top + u.height - s))
                        : ((a = e.left - c),
                          (l = e.left + c + n),
                          a < u.left
                              ? (i.left = u.left - a)
                              : l > u.width && (i.left = u.left + u.width - l)),
                    i
                )
            }),
            (v.prototype.getTitle = function () {
                var t = this.$element,
                    e = this.options
                return (
                    t.attr("data-original-title") ||
                    ("function" == typeof e.title
                        ? e.title.call(t[0])
                        : e.title)
                )
            }),
            (v.prototype.getUID = function (t) {
                for (
                    ;
                    (t += ~~(1e6 * Math.random())), document.getElementById(t);

                );
                return t
            }),
            (v.prototype.tip = function () {
                return (this.$tip = this.$tip || m(this.options.template))
            }),
            (v.prototype.arrow = function () {
                return (this.$arrow =
                    this.$arrow || this.tip().find(".tooltip-arrow"))
            }),
            (v.prototype.enable = function () {
                this.enabled = !0
            }),
            (v.prototype.disable = function () {
                this.enabled = !1
            }),
            (v.prototype.toggleEnabled = function () {
                this.enabled = !this.enabled
            }),
            (v.prototype.toggle = function (t) {
                var e = this
                t &&
                    ((e = m(t.currentTarget).data("bs." + this.type)) ||
                        ((e = new this.constructor(
                            t.currentTarget,
                            this.getDelegateOptions()
                        )),
                        m(t.currentTarget).data("bs." + this.type, e))),
                    e.tip().hasClass("in") ? e.leave(e) : e.enter(e)
            }),
            (v.prototype.destroy = function () {
                var t = this
                clearTimeout(this.timeout),
                    this.hide(function () {
                        t.$element.off("." + t.type).removeData("bs." + t.type)
                    })
            })
        var t = m.fn.tooltip
        ;(m.fn.tooltip = function (r) {
            return this.each(function () {
                var t = m(this),
                    e = t.data("bs.tooltip"),
                    n = "object" == typeof r && r
                ;(!e && "destroy" == r) ||
                    (e || t.data("bs.tooltip", (e = new v(this, n))),
                    "string" == typeof r && e[r]())
            })
        }),
            (m.fn.tooltip.Constructor = v),
            (m.fn.tooltip.noConflict = function () {
                return (m.fn.tooltip = t), this
            })
    })(jQuery),
    (function (i) {
        "use strict"
        function o(t, e) {
            this.init("popover", t, e)
        }
        if (!i.fn.tooltip) throw new Error("Popover requires tooltip.js")
        ;(o.VERSION = "3.3.2"),
            (o.DEFAULTS = i.extend({}, i.fn.tooltip.Constructor.DEFAULTS, {
                placement: "right",
                trigger: "click",
                content: "",
                template:
                    '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
            })),
            (((o.prototype = i.extend(
                {},
                i.fn.tooltip.Constructor.prototype
            )).constructor = o).prototype.getDefaults = function () {
                return o.DEFAULTS
            }),
            (o.prototype.setContent = function () {
                var t = this.tip(),
                    e = this.getTitle(),
                    n = this.getContent()
                t
                    .find(".popover-title")
                    [this.options.html ? "html" : "text"](e),
                    t
                        .find(".popover-content")
                        .children()
                        .detach()
                        .end()
                        [
                            this.options.html
                                ? "string" == typeof n
                                    ? "html"
                                    : "append"
                                : "text"
                        ](n),
                    t.removeClass("fade top bottom left right in"),
                    t.find(".popover-title").html() ||
                        t.find(".popover-title").hide()
            }),
            (o.prototype.hasContent = function () {
                return this.getTitle() || this.getContent()
            }),
            (o.prototype.getContent = function () {
                var t = this.$element,
                    e = this.options
                return (
                    t.attr("data-content") ||
                    ("function" == typeof e.content
                        ? e.content.call(t[0])
                        : e.content)
                )
            }),
            (o.prototype.arrow = function () {
                return (this.$arrow = this.$arrow || this.tip().find(".arrow"))
            }),
            (o.prototype.tip = function () {
                return (
                    this.$tip || (this.$tip = i(this.options.template)),
                    this.$tip
                )
            })
        var t = i.fn.popover
        ;(i.fn.popover = function (r) {
            return this.each(function () {
                var t = i(this),
                    e = t.data("bs.popover"),
                    n = "object" == typeof r && r
                ;(!e && "destroy" == r) ||
                    (e || t.data("bs.popover", (e = new o(this, n))),
                    "string" == typeof r && e[r]())
            })
        }),
            (i.fn.popover.Constructor = o),
            (i.fn.popover.noConflict = function () {
                return (i.fn.popover = t), this
            })
    })(jQuery),
    (function (o) {
        "use strict"
        function i(t, e) {
            var n = o.proxy(this.process, this)
            ;(this.$body = o("body")),
                (this.$scrollElement = o(t).is("body") ? o(window) : o(t)),
                (this.options = o.extend({}, i.DEFAULTS, e)),
                (this.selector = (this.options.target || "") + " .nav li > a"),
                (this.offsets = []),
                (this.targets = []),
                (this.activeTarget = null),
                (this.scrollHeight = 0),
                this.$scrollElement.on("scroll.bs.scrollspy", n),
                this.refresh(),
                this.process()
        }
        function e(r) {
            return this.each(function () {
                var t = o(this),
                    e = t.data("bs.scrollspy"),
                    n = "object" == typeof r && r
                e || t.data("bs.scrollspy", (e = new i(this, n))),
                    "string" == typeof r && e[r]()
            })
        }
        ;(i.VERSION = "3.3.2"),
            (i.DEFAULTS = { offset: 10 }),
            (i.prototype.getScrollHeight = function () {
                return (
                    this.$scrollElement[0].scrollHeight ||
                    Math.max(
                        this.$body[0].scrollHeight,
                        document.documentElement.scrollHeight
                    )
                )
            }),
            (i.prototype.refresh = function () {
                var r = "offset",
                    i = 0
                o.isWindow(this.$scrollElement[0]) ||
                    ((r = "position"), (i = this.$scrollElement.scrollTop())),
                    (this.offsets = []),
                    (this.targets = []),
                    (this.scrollHeight = this.getScrollHeight())
                var t = this
                this.$body
                    .find(this.selector)
                    .map(function () {
                        var t = o(this),
                            e = t.data("target") || t.attr("href"),
                            n = /^#./.test(e) && o(e)
                        return n && n.length && n.is(":visible")
                            ? [[n[r]().top + i, e]]
                            : null
                    })
                    .sort(function (t, e) {
                        return t[0] - e[0]
                    })
                    .each(function () {
                        t.offsets.push(this[0]), t.targets.push(this[1])
                    })
            }),
            (i.prototype.process = function () {
                var t,
                    e = this.$scrollElement.scrollTop() + this.options.offset,
                    n = this.getScrollHeight(),
                    r = this.options.offset + n - this.$scrollElement.height(),
                    i = this.offsets,
                    o = this.targets,
                    s = this.activeTarget
                if ((this.scrollHeight != n && this.refresh(), r <= e))
                    return s != (t = o[o.length - 1]) && this.activate(t)
                if (s && e < i[0])
                    return (this.activeTarget = null), this.clear()
                for (t = i.length; t--; )
                    s != o[t] &&
                        e >= i[t] &&
                        (!i[t + 1] || e <= i[t + 1]) &&
                        this.activate(o[t])
            }),
            (i.prototype.activate = function (t) {
                ;(this.activeTarget = t), this.clear()
                var e =
                        this.selector +
                        '[data-target="' +
                        t +
                        '"],' +
                        this.selector +
                        '[href="' +
                        t +
                        '"]',
                    n = o(e).parents("li").addClass("active")
                n.parent(".dropdown-menu").length &&
                    (n = n.closest("li.dropdown").addClass("active")),
                    n.trigger("activate.bs.scrollspy")
            }),
            (i.prototype.clear = function () {
                o(this.selector)
                    .parentsUntil(this.options.target, ".active")
                    .removeClass("active")
            })
        var t = o.fn.scrollspy
        ;(o.fn.scrollspy = e),
            (o.fn.scrollspy.Constructor = i),
            (o.fn.scrollspy.noConflict = function () {
                return (o.fn.scrollspy = t), this
            }),
            o(window).on("load.bs.scrollspy.data-api", function () {
                o('[data-spy="scroll"]').each(function () {
                    var t = o(this)
                    e.call(t, t.data())
                })
            })
    })(jQuery),
    (function (a) {
        "use strict"
        function s(t) {
            this.element = a(t)
        }
        function e(n) {
            return this.each(function () {
                var t = a(this),
                    e = t.data("bs.tab")
                e || t.data("bs.tab", (e = new s(this))),
                    "string" == typeof n && e[n]()
            })
        }
        ;(s.VERSION = "3.3.2"),
            (s.TRANSITION_DURATION = 150),
            (s.prototype.show = function () {
                var t,
                    e,
                    n,
                    r,
                    i = this.element,
                    o = i.closest("ul:not(.dropdown-menu)"),
                    s =
                        (s = i.data("target")) ||
                        ((s = i.attr("href")) &&
                            s.replace(/.*(?=#[^\s]*$)/, ""))
                i.parent("li").hasClass("active") ||
                    ((t = o.find(".active:last a")),
                    (e = a.Event("hide.bs.tab", { relatedTarget: i[0] })),
                    (n = a.Event("show.bs.tab", { relatedTarget: t[0] })),
                    t.trigger(e),
                    i.trigger(n),
                    n.isDefaultPrevented() ||
                        e.isDefaultPrevented() ||
                        ((r = a(s)),
                        this.activate(i.closest("li"), o),
                        this.activate(r, r.parent(), function () {
                            t.trigger({
                                type: "hidden.bs.tab",
                                relatedTarget: i[0],
                            }),
                                i.trigger({
                                    type: "shown.bs.tab",
                                    relatedTarget: t[0],
                                })
                        })))
            }),
            (s.prototype.activate = function (t, e, n) {
                var r = e.find("> .active"),
                    i =
                        n &&
                        a.support.transition &&
                        ((r.length && r.hasClass("fade")) ||
                            !!e.find("> .fade").length)
                function o() {
                    r
                        .removeClass("active")
                        .find("> .dropdown-menu > .active")
                        .removeClass("active")
                        .end()
                        .find('[data-toggle="tab"]')
                        .attr("aria-expanded", !1),
                        t
                            .addClass("active")
                            .find('[data-toggle="tab"]')
                            .attr("aria-expanded", !0),
                        i
                            ? (t[0].offsetWidth, t.addClass("in"))
                            : t.removeClass("fade"),
                        t.parent(".dropdown-menu") &&
                            t
                                .closest("li.dropdown")
                                .addClass("active")
                                .end()
                                .find('[data-toggle="tab"]')
                                .attr("aria-expanded", !0),
                        n && n()
                }
                r.length && i
                    ? r
                          .one("bsTransitionEnd", o)
                          .emulateTransitionEnd(s.TRANSITION_DURATION)
                    : o(),
                    r.removeClass("in")
            })
        var t = a.fn.tab
        ;(a.fn.tab = e),
            (a.fn.tab.Constructor = s),
            (a.fn.tab.noConflict = function () {
                return (a.fn.tab = t), this
            })
        function n(t) {
            t.preventDefault(), e.call(a(this), "show")
        }
        a(document)
            .on("click.bs.tab.data-api", '[data-toggle="tab"]', n)
            .on("click.bs.tab.data-api", '[data-toggle="pill"]', n)
    })(jQuery),
    (function (l) {
        "use strict"
        var c = function (t, e) {
            ;(this.options = l.extend({}, c.DEFAULTS, e)),
                (this.$target = l(this.options.target)
                    .on(
                        "scroll.bs.affix.data-api",
                        l.proxy(this.checkPosition, this)
                    )
                    .on(
                        "click.bs.affix.data-api",
                        l.proxy(this.checkPositionWithEventLoop, this)
                    )),
                (this.$element = l(t)),
                (this.affixed = this.unpin = this.pinnedOffset = null),
                this.checkPosition()
        }
        function n(r) {
            return this.each(function () {
                var t = l(this),
                    e = t.data("bs.affix"),
                    n = "object" == typeof r && r
                e || t.data("bs.affix", (e = new c(this, n))),
                    "string" == typeof r && e[r]()
            })
        }
        ;(c.VERSION = "3.3.2"),
            (c.RESET = "affix affix-top affix-bottom"),
            (c.DEFAULTS = { offset: 0, target: window }),
            (c.prototype.getState = function (t, e, n, r) {
                var i = this.$target.scrollTop(),
                    o = this.$element.offset(),
                    s = this.$target.height()
                if (null != n && "top" == this.affixed) return i < n && "top"
                if ("bottom" == this.affixed)
                    return null != n
                        ? !(i + this.unpin <= o.top) && "bottom"
                        : !(i + s <= t - r) && "bottom"
                var a = null == this.affixed,
                    l = a ? i : o.top
                return null != n && i <= n
                    ? "top"
                    : null != r && t - r <= l + (a ? s : e) && "bottom"
            }),
            (c.prototype.getPinnedOffset = function () {
                if (this.pinnedOffset) return this.pinnedOffset
                this.$element.removeClass(c.RESET).addClass("affix")
                var t = this.$target.scrollTop(),
                    e = this.$element.offset()
                return (this.pinnedOffset = e.top - t)
            }),
            (c.prototype.checkPositionWithEventLoop = function () {
                setTimeout(l.proxy(this.checkPosition, this), 1)
            }),
            (c.prototype.checkPosition = function () {
                if (this.$element.is(":visible")) {
                    var t = this.$element.height(),
                        e = this.options.offset,
                        n = e.top,
                        r = e.bottom,
                        i = l("body").height()
                    "object" != typeof e && (r = n = e),
                        "function" == typeof n && (n = e.top(this.$element)),
                        "function" == typeof r && (r = e.bottom(this.$element))
                    var o = this.getState(i, t, n, r)
                    if (this.affixed != o) {
                        null != this.unpin && this.$element.css("top", "")
                        var s = "affix" + (o ? "-" + o : ""),
                            a = l.Event(s + ".bs.affix")
                        if ((this.$element.trigger(a), a.isDefaultPrevented()))
                            return
                        ;(this.affixed = o),
                            (this.unpin =
                                "bottom" == o ? this.getPinnedOffset() : null),
                            this.$element
                                .removeClass(c.RESET)
                                .addClass(s)
                                .trigger(
                                    s.replace("affix", "affixed") + ".bs.affix"
                                )
                    }
                    "bottom" == o && this.$element.offset({ top: i - t - r })
                }
            })
        var t = l.fn.affix
        ;(l.fn.affix = n),
            (l.fn.affix.Constructor = c),
            (l.fn.affix.noConflict = function () {
                return (l.fn.affix = t), this
            }),
            l(window).on("load", function () {
                l('[data-spy="affix"]').each(function () {
                    var t = l(this),
                        e = t.data()
                    ;(e.offset = e.offset || {}),
                        null != e.offsetBottom &&
                            (e.offset.bottom = e.offsetBottom),
                        null != e.offsetTop && (e.offset.top = e.offsetTop),
                        n.call(t, e)
                })
            })
    })(jQuery),
    (function (t, e) {
        "object" == typeof exports
            ? (module.exports = e(
                  require("./punycode"),
                  require("./IPv6"),
                  require("./SecondLevelDomains")
              ))
            : "function" == typeof define && define.amd
            ? define(["./punycode", "./IPv6", "./SecondLevelDomains"], e)
            : (t.URI = e(t.punycode, t.IPv6, t.SecondLevelDomains, t))
    })(this, function (a, e, c, n) {
        function u(t, e) {
            var n = 1 <= arguments.length
            if (!(this instanceof u))
                return n
                    ? 2 <= arguments.length
                        ? new u(t, e)
                        : new u(t)
                    : new u()
            if (void 0 === t) {
                if (n)
                    throw new TypeError(
                        "undefined is not a valid argument for URI"
                    )
                t = "undefined" != typeof location ? location.href + "" : ""
            }
            return this.href(t), void 0 !== e ? this.absoluteTo(e) : this
        }
        function i(t) {
            return t.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
        }
        function o(t) {
            return void 0 === t
                ? "Undefined"
                : String(Object.prototype.toString.call(t)).slice(8, -1)
        }
        function l(t) {
            return "Array" === o(t)
        }
        function s(t, e) {
            var n,
                r,
                i = {}
            if ("RegExp" === o(e)) i = null
            else if (l(e)) for (n = 0, r = e.length; n < r; n++) i[e[n]] = !0
            else i[e] = !0
            for (n = 0, r = t.length; n < r; n++)
                ((i && void 0 !== i[t[n]]) || (!i && e.test(t[n]))) &&
                    (t.splice(n, 1), r--, n--)
            return t
        }
        function p(t, e) {
            if (l(e)) {
                for (r = 0, i = e.length; r < i; r++) if (!p(t, e[r])) return !1
                return !0
            }
            for (var n = o(e), r = 0, i = t.length; r < i; r++)
                if ("RegExp" === n) {
                    if ("string" == typeof t[r] && t[r].match(e)) return !0
                } else if (t[r] === e) return !0
            return !1
        }
        function h(t, e) {
            if (!l(t) || !l(e) || t.length !== e.length) return !1
            t.sort(), e.sort()
            for (var n = 0, r = t.length; n < r; n++)
                if (t[n] !== e[n]) return !1
            return !0
        }
        function r(t) {
            return escape(t)
        }
        function d(t) {
            return encodeURIComponent(t)
                .replace(/[!'()*]/g, r)
                .replace(/\*/g, "%2A")
        }
        function t(n) {
            return function (t, e) {
                return void 0 === t
                    ? this._parts[n] || ""
                    : ((this._parts[n] = t || null), this.build(!e), this)
            }
        }
        function f(n, r) {
            return function (t, e) {
                return void 0 === t
                    ? this._parts[n] || ""
                    : (null !== t &&
                          (t += "").charAt(0) === r &&
                          (t = t.substring(1)),
                      (this._parts[n] = t),
                      this.build(!e),
                      this)
            }
        }
        var g = n && n.URI
        u.version = "1.15.1"
        var m = u.prototype,
            v = Object.prototype.hasOwnProperty
        ;(u._parts = function () {
            return {
                protocol: null,
                username: null,
                password: null,
                hostname: null,
                urn: null,
                port: null,
                path: null,
                query: null,
                fragment: null,
                duplicateQueryParameters: u.duplicateQueryParameters,
                escapeQuerySpace: u.escapeQuerySpace,
            }
        }),
            (u.duplicateQueryParameters = !1),
            (u.escapeQuerySpace = !0),
            (u.protocol_expression = /^[a-z][a-z0-9.+-]*$/i),
            (u.idn_expression = /[^a-z0-9\.-]/i),
            (u.punycode_expression = /(xn--)/i),
            (u.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/),
            (u.ip6_expression =
                /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/),
            (u.find_uri_expression =
                /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/gi),
            (u.findUri = {
                start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
                end: /[\s\r\n]|$/,
                trim: /[`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019]+$/,
            }),
            (u.defaultPorts = {
                http: "80",
                https: "443",
                ftp: "21",
                gopher: "70",
                ws: "80",
                wss: "443",
            }),
            (u.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/),
            (u.domAttributes = {
                a: "href",
                blockquote: "cite",
                link: "href",
                base: "href",
                script: "src",
                form: "action",
                img: "src",
                area: "href",
                iframe: "src",
                embed: "src",
                source: "src",
                track: "src",
                input: "src",
                audio: "src",
                video: "src",
            }),
            (u.getDomAttribute = function (t) {
                if (t && t.nodeName) {
                    var e = t.nodeName.toLowerCase()
                    return "input" === e && "image" !== t.type
                        ? void 0
                        : u.domAttributes[e]
                }
            }),
            (u.encode = d),
            (u.decode = decodeURIComponent),
            (u.iso8859 = function () {
                ;(u.encode = escape), (u.decode = unescape)
            }),
            (u.unicode = function () {
                ;(u.encode = d), (u.decode = decodeURIComponent)
            }),
            (u.characters = {
                pathname: {
                    encode: {
                        expression: /%(24|26|2B|2C|3B|3D|3A|40)/gi,
                        map: {
                            "%24": "$",
                            "%26": "&",
                            "%2B": "+",
                            "%2C": ",",
                            "%3B": ";",
                            "%3D": "=",
                            "%3A": ":",
                            "%40": "@",
                        },
                    },
                    decode: {
                        expression: /[\/\?#]/g,
                        map: { "/": "%2F", "?": "%3F", "#": "%23" },
                    },
                },
                reserved: {
                    encode: {
                        expression:
                            /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/gi,
                        map: {
                            "%3A": ":",
                            "%2F": "/",
                            "%3F": "?",
                            "%23": "#",
                            "%5B": "[",
                            "%5D": "]",
                            "%40": "@",
                            "%21": "!",
                            "%24": "$",
                            "%26": "&",
                            "%27": "'",
                            "%28": "(",
                            "%29": ")",
                            "%2A": "*",
                            "%2B": "+",
                            "%2C": ",",
                            "%3B": ";",
                            "%3D": "=",
                        },
                    },
                },
                urnpath: {
                    encode: {
                        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/gi,
                        map: {
                            "%21": "!",
                            "%24": "$",
                            "%27": "'",
                            "%28": "(",
                            "%29": ")",
                            "%2A": "*",
                            "%2B": "+",
                            "%2C": ",",
                            "%3B": ";",
                            "%3D": "=",
                            "%40": "@",
                        },
                    },
                    decode: {
                        expression: /[\/\?#:]/g,
                        map: { "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" },
                    },
                },
            }),
            (u.encodeQuery = function (t, e) {
                var n = u.encode(t + "")
                return (
                    void 0 === e && (e = u.escapeQuerySpace),
                    e ? n.replace(/%20/g, "+") : n
                )
            }),
            (u.decodeQuery = function (e, t) {
                ;(e += ""), void 0 === t && (t = u.escapeQuerySpace)
                try {
                    return u.decode(t ? e.replace(/\+/g, "%20") : e)
                } catch (t) {
                    return e
                }
            })
        function y(n, r) {
            return function (e) {
                try {
                    return u[r](e + "").replace(
                        u.characters[n][r].expression,
                        function (t) {
                            return u.characters[n][r].map[t]
                        }
                    )
                } catch (t) {
                    return e
                }
            }
        }
        var b,
            w = { encode: "encode", decode: "decode" }
        for (b in w)
            (u[b + "PathSegment"] = y("pathname", w[b])),
                (u[b + "UrnPathSegment"] = y("urnpath", w[b]))
        ;(w = function (i, o, s) {
            return function (t) {
                for (
                    var e = s
                            ? function (t) {
                                  return u[o](u[s](t))
                              }
                            : u[o],
                        n = 0,
                        r = (t = (t + "").split(i)).length;
                    n < r;
                    n++
                )
                    t[n] = e(t[n])
                return t.join(i)
            }
        }),
            (u.decodePath = w("/", "decodePathSegment")),
            (u.decodeUrnPath = w(":", "decodeUrnPathSegment")),
            (u.recodePath = w("/", "encodePathSegment", "decode")),
            (u.recodeUrnPath = w(":", "encodeUrnPathSegment", "decode")),
            (u.encodeReserved = y("reserved", "encode")),
            (u.parse = function (t, e) {
                var n
                return (
                    (e = e || {}),
                    -1 < (n = t.indexOf("#")) &&
                        ((e.fragment = t.substring(n + 1) || null),
                        (t = t.substring(0, n))),
                    -1 < (n = t.indexOf("?")) &&
                        ((e.query = t.substring(n + 1) || null),
                        (t = t.substring(0, n))),
                    "//" === t.substring(0, 2)
                        ? ((e.protocol = null),
                          (t = t.substring(2)),
                          (t = u.parseAuthority(t, e)))
                        : -1 < (n = t.indexOf(":")) &&
                          ((e.protocol = t.substring(0, n) || null),
                          e.protocol && !e.protocol.match(u.protocol_expression)
                              ? (e.protocol = void 0)
                              : "//" === t.substring(n + 1, n + 3)
                              ? ((t = t.substring(n + 3)),
                                (t = u.parseAuthority(t, e)))
                              : ((t = t.substring(n + 1)), (e.urn = !0))),
                    (e.path = t),
                    e
                )
            }),
            (u.parseHost = function (t, e) {
                var n,
                    r,
                    i = t.indexOf("/")
                return (
                    -1 === i && (i = t.length),
                    "[" === t.charAt(0)
                        ? ((n = t.indexOf("]")),
                          (e.hostname = t.substring(1, n) || null),
                          (e.port = t.substring(n + 2, i) || null),
                          "/" === e.port && (e.port = null))
                        : ((r = t.indexOf(":")),
                          (n = t.indexOf("/")),
                          -1 !== (r = t.indexOf(":", r + 1)) &&
                          (-1 === n || r < n)
                              ? ((e.hostname = t.substring(0, i) || null),
                                (e.port = null))
                              : ((n = t.substring(0, i).split(":")),
                                (e.hostname = n[0] || null),
                                (e.port = n[1] || null))),
                    e.hostname &&
                        "/" !== t.substring(i).charAt(0) &&
                        (i++, (t = "/" + t)),
                    t.substring(i) || "/"
                )
            }),
            (u.parseAuthority = function (t, e) {
                return (t = u.parseUserinfo(t, e)), u.parseHost(t, e)
            }),
            (u.parseUserinfo = function (t, e) {
                var n = t.indexOf("/"),
                    r = t.lastIndexOf("@", -1 < n ? n : t.length - 1)
                return (
                    -1 < r && (-1 === n || r < n)
                        ? ((n = t.substring(0, r).split(":")),
                          (e.username = n[0] ? u.decode(n[0]) : null),
                          n.shift(),
                          (e.password = n[0] ? u.decode(n.join(":")) : null),
                          (t = t.substring(r + 1)))
                        : ((e.username = null), (e.password = null)),
                    t
                )
            }),
            (u.parseQuery = function (t, e) {
                if (!t) return {}
                if (!(t = t.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, "")))
                    return {}
                for (
                    var n, r, i = {}, o = t.split("&"), s = o.length, a = 0;
                    a < s;
                    a++
                )
                    (n = o[a].split("=")),
                        (r = u.decodeQuery(n.shift(), e)),
                        (n = n.length ? u.decodeQuery(n.join("="), e) : null),
                        v.call(i, r)
                            ? ("string" == typeof i[r] && (i[r] = [i[r]]),
                              i[r].push(n))
                            : (i[r] = n)
                return i
            }),
            (u.build = function (t) {
                var e = ""
                return (
                    t.protocol && (e += t.protocol + ":"),
                    t.urn || (!e && !t.hostname) || (e += "//"),
                    (e += u.buildAuthority(t) || ""),
                    "string" == typeof t.path &&
                        ("/" !== t.path.charAt(0) &&
                            "string" == typeof t.hostname &&
                            (e += "/"),
                        (e += t.path)),
                    "string" == typeof t.query &&
                        t.query &&
                        (e += "?" + t.query),
                    "string" == typeof t.fragment &&
                        t.fragment &&
                        (e += "#" + t.fragment),
                    e
                )
            }),
            (u.buildHost = function (t) {
                var e = ""
                return t.hostname
                    ? ((e = u.ip6_expression.test(t.hostname)
                          ? e + ("[" + t.hostname) + "]"
                          : e + t.hostname),
                      t.port && (e += ":" + t.port),
                      e)
                    : ""
            }),
            (u.buildAuthority = function (t) {
                return u.buildUserinfo(t) + u.buildHost(t)
            }),
            (u.buildUserinfo = function (t) {
                var e = ""
                return (
                    t.username &&
                        ((e += u.encode(t.username)),
                        t.password && (e += ":" + u.encode(t.password)),
                        (e += "@")),
                    e
                )
            }),
            (u.buildQuery = function (t, e, n) {
                var r,
                    i,
                    o,
                    s,
                    a = ""
                for (i in t)
                    if (v.call(t, i) && i)
                        if (l(t[i]))
                            for (r = {}, o = 0, s = t[i].length; o < s; o++)
                                void 0 !== t[i][o] &&
                                    void 0 === r[t[i][o] + ""] &&
                                    ((a +=
                                        "&" +
                                        u.buildQueryParameter(i, t[i][o], n)),
                                    !0 !== e && (r[t[i][o] + ""] = !0))
                        else
                            void 0 !== t[i] &&
                                (a += "&" + u.buildQueryParameter(i, t[i], n))
                return a.substring(1)
            }),
            (u.buildQueryParameter = function (t, e, n) {
                return (
                    u.encodeQuery(t, n) +
                    (null !== e ? "=" + u.encodeQuery(e, n) : "")
                )
            }),
            (u.addQuery = function (t, e, n) {
                if ("object" == typeof e)
                    for (var r in e) v.call(e, r) && u.addQuery(t, r, e[r])
                else {
                    if ("string" != typeof e)
                        throw new TypeError(
                            "URI.addQuery() accepts an object, string as the name parameter"
                        )
                    void 0 === t[e]
                        ? (t[e] = n)
                        : ("string" == typeof t[e] && (t[e] = [t[e]]),
                          l(n) || (n = [n]),
                          (t[e] = (t[e] || []).concat(n)))
                }
            }),
            (u.removeQuery = function (t, e, n) {
                var r
                if (l(e)) for (n = 0, r = e.length; n < r; n++) t[e[n]] = void 0
                else if ("RegExp" === o(e))
                    for (r in t) e.test(r) && (t[r] = void 0)
                else if ("object" == typeof e)
                    for (r in e) v.call(e, r) && u.removeQuery(t, r, e[r])
                else {
                    if ("string" != typeof e)
                        throw new TypeError(
                            "URI.removeQuery() accepts an object, string, RegExp as the first parameter"
                        )
                    void 0 !== n
                        ? "RegExp" === o(n)
                            ? !l(t[e]) && n.test(t[e])
                                ? (t[e] = void 0)
                                : (t[e] = s(t[e], n))
                            : t[e] === n
                            ? (t[e] = void 0)
                            : l(t[e]) && (t[e] = s(t[e], n))
                        : (t[e] = void 0)
                }
            }),
            (u.hasQuery = function (t, e, n, r) {
                if ("object" == typeof e) {
                    for (var i in e)
                        if (v.call(e, i) && !u.hasQuery(t, i, e[i])) return !1
                    return !0
                }
                if ("string" != typeof e)
                    throw new TypeError(
                        "URI.hasQuery() accepts an object, string as the name parameter"
                    )
                switch (o(n)) {
                    case "Undefined":
                        return e in t
                    case "Boolean":
                        return n === (t = Boolean(l(t[e]) ? t[e].length : t[e]))
                    case "Function":
                        return !!n(t[e], e, t)
                    case "Array":
                        return !!l(t[e]) && (r ? p : h)(t[e], n)
                    case "RegExp":
                        return l(t[e])
                            ? !!r && p(t[e], n)
                            : Boolean(t[e] && t[e].match(n))
                    case "Number":
                        n = String(n)
                    case "String":
                        return l(t[e]) ? !!r && p(t[e], n) : t[e] === n
                    default:
                        throw new TypeError(
                            "URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter"
                        )
                }
            }),
            (u.commonPath = function (t, e) {
                for (var n = Math.min(t.length, e.length), r = 0; r < n; r++)
                    if (t.charAt(r) !== e.charAt(r)) {
                        r--
                        break
                    }
                return r < 1
                    ? t.charAt(0) === e.charAt(0) && "/" === t.charAt(0)
                        ? "/"
                        : ""
                    : (("/" === t.charAt(r) && "/" === e.charAt(r)) ||
                          (r = t.substring(0, r).lastIndexOf("/")),
                      t.substring(0, r + 1))
            }),
            (u.withinString = function (t, e, n) {
                var r = (n = n || {}).start || u.findUri.start,
                    i = n.end || u.findUri.end,
                    o = n.trim || u.findUri.trim,
                    s = /[a-z0-9-]=["']?$/i
                for (r.lastIndex = 0; ; ) {
                    var a = r.exec(t)
                    if (!a) break
                    if (((a = a.index), n.ignoreHtml))
                        if ((l = t.slice(Math.max(a - 3, 0), a)) && s.test(l))
                            continue
                    var l = a + t.slice(a).search(i),
                        c = t.slice(a, l).replace(o, "")
                    ;(n.ignore && n.ignore.test(c)) ||
                        ((c = e(c, a, (l = a + c.length), t)),
                        (t = t.slice(0, a) + c + t.slice(l)),
                        (r.lastIndex = a + c.length))
                }
                return (r.lastIndex = 0), t
            }),
            (u.ensureValidHostname = function (t) {
                if (t.match(u.invalid_hostname_characters)) {
                    if (!a)
                        throw new TypeError(
                            'Hostname "' +
                                t +
                                '" contains characters other than [A-Z0-9.-] and Punycode.js is not available'
                        )
                    if (a.toASCII(t).match(u.invalid_hostname_characters))
                        throw new TypeError(
                            'Hostname "' +
                                t +
                                '" contains characters other than [A-Z0-9.-]'
                        )
                }
            }),
            (u.noConflict = function (t) {
                return t
                    ? ((t = { URI: this.noConflict() }),
                      n.URITemplate &&
                          "function" == typeof n.URITemplate.noConflict &&
                          (t.URITemplate = n.URITemplate.noConflict()),
                      n.IPv6 &&
                          "function" == typeof n.IPv6.noConflict &&
                          (t.IPv6 = n.IPv6.noConflict()),
                      n.SecondLevelDomains &&
                          "function" ==
                              typeof n.SecondLevelDomains.noConflict &&
                          (t.SecondLevelDomains =
                              n.SecondLevelDomains.noConflict()),
                      t)
                    : (n.URI === this && (n.URI = g), this)
            }),
            (m.build = function (t) {
                return (
                    !0 === t
                        ? (this._deferred_build = !0)
                        : (void 0 !== t && !this._deferred_build) ||
                          ((this._string = u.build(this._parts)),
                          (this._deferred_build = !1)),
                    this
                )
            }),
            (m.clone = function () {
                return new u(this)
            }),
            (m.valueOf = m.toString =
                function () {
                    return this.build(!1)._string
                }),
            (m.protocol = t("protocol")),
            (m.username = t("username")),
            (m.password = t("password")),
            (m.hostname = t("hostname")),
            (m.port = t("port")),
            (m.query = f("query", "?")),
            (m.fragment = f("fragment", "#")),
            (m.search = function (t, e) {
                var n = this.query(t, e)
                return "string" == typeof n && n.length ? "?" + n : n
            }),
            (m.hash = function (t, e) {
                var n = this.fragment(t, e)
                return "string" == typeof n && n.length ? "#" + n : n
            }),
            (m.pathname = function (t, e) {
                if (void 0 !== t && !0 !== t)
                    return (
                        (this._parts.path = this._parts.urn
                            ? t
                                ? u.recodeUrnPath(t)
                                : ""
                            : t
                            ? u.recodePath(t)
                            : "/"),
                        this.build(!e),
                        this
                    )
                var n = this._parts.path || (this._parts.hostname ? "/" : "")
                return t
                    ? (this._parts.urn ? u.decodeUrnPath : u.decodePath)(n)
                    : n
            }),
            (m.path = m.pathname),
            (m.href = function (t, e) {
                var n
                if (void 0 === t) return this.toString()
                ;(this._string = ""), (this._parts = u._parts())
                var r = t instanceof u,
                    i =
                        "object" == typeof t &&
                        (t.hostname || t.path || t.pathname)
                if (
                    (t.nodeName &&
                        ((t = t[(i = u.getDomAttribute(t))] || ""), (i = !1)),
                    !r && i && void 0 !== t.pathname && (t = t.toString()),
                    "string" == typeof t || t instanceof String)
                )
                    this._parts = u.parse(String(t), this._parts)
                else {
                    if (!r && !i) throw new TypeError("invalid input")
                    for (n in (r = r ? t._parts : t))
                        v.call(this._parts, n) && (this._parts[n] = r[n])
                }
                return this.build(!e), this
            }),
            (m.is = function (t) {
                var e = !1,
                    n = !1,
                    r = !1,
                    i = !1,
                    o = !1,
                    s = !1,
                    a = !1,
                    l = !this._parts.urn
                switch (
                    (this._parts.hostname &&
                        ((l = !1),
                        (n = u.ip4_expression.test(this._parts.hostname)),
                        (r = u.ip6_expression.test(this._parts.hostname)),
                        (o =
                            (i = !(e = n || r)) &&
                            c &&
                            c.has(this._parts.hostname)),
                        (s = i && u.idn_expression.test(this._parts.hostname)),
                        (a =
                            i &&
                            u.punycode_expression.test(this._parts.hostname))),
                    t.toLowerCase())
                ) {
                    case "relative":
                        return l
                    case "absolute":
                        return !l
                    case "domain":
                    case "name":
                        return i
                    case "sld":
                        return o
                    case "ip":
                        return e
                    case "ip4":
                    case "ipv4":
                    case "inet4":
                        return n
                    case "ip6":
                    case "ipv6":
                    case "inet6":
                        return r
                    case "idn":
                        return s
                    case "url":
                        return !this._parts.urn
                    case "urn":
                        return !!this._parts.urn
                    case "punycode":
                        return a
                }
                return null
            })
        var x = m.protocol,
            T = m.port,
            C = m.hostname
        ;(m.protocol = function (t, e) {
            if (
                void 0 !== t &&
                t &&
                !(t = t.replace(/:(\/\/)?$/, "")).match(u.protocol_expression)
            )
                throw new TypeError(
                    'Protocol "' +
                        t +
                        "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]"
                )
            return x.call(this, t, e)
        }),
            (m.scheme = m.protocol),
            (m.port = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (
                    void 0 !== t &&
                    (0 === t && (t = null),
                    t &&
                        (":" === (t += "").charAt(0) && (t = t.substring(1)),
                        t.match(/[^0-9]/)))
                )
                    throw new TypeError(
                        'Port "' + t + '" contains characters other than [0-9]'
                    )
                return T.call(this, t, e)
            }),
            (m.hostname = function (t, e) {
                return this._parts.urn
                    ? void 0 === t
                        ? ""
                        : this
                    : (void 0 !== t &&
                          (u.parseHost(t, (n = {})), (t = n.hostname)),
                      C.call(this, t, e))
                var n
            }),
            (m.host = function (t, e) {
                return this._parts.urn
                    ? void 0 === t
                        ? ""
                        : this
                    : void 0 === t
                    ? this._parts.hostname
                        ? u.buildHost(this._parts)
                        : ""
                    : (u.parseHost(t, this._parts), this.build(!e), this)
            }),
            (m.authority = function (t, e) {
                return this._parts.urn
                    ? void 0 === t
                        ? ""
                        : this
                    : void 0 === t
                    ? this._parts.hostname
                        ? u.buildAuthority(this._parts)
                        : ""
                    : (u.parseAuthority(t, this._parts), this.build(!e), this)
            }),
            (m.userinfo = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (void 0 !== t)
                    return (
                        "@" !== t[t.length - 1] && (t += "@"),
                        u.parseUserinfo(t, this._parts),
                        this.build(!e),
                        this
                    )
                if (!this._parts.username) return ""
                var n = u.buildUserinfo(this._parts)
                return n.substring(0, n.length - 1)
            }),
            (m.resource = function (t, e) {
                var n
                return void 0 === t
                    ? this.path() + this.search() + this.hash()
                    : ((n = u.parse(t)),
                      (this._parts.path = n.path),
                      (this._parts.query = n.query),
                      (this._parts.fragment = n.fragment),
                      this.build(!e),
                      this)
            }),
            (m.subdomain = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (void 0 !== t)
                    return (
                        (n =
                            this._parts.hostname.length - this.domain().length),
                        (n = this._parts.hostname.substring(0, n)),
                        (n = new RegExp("^" + i(n))),
                        t && "." !== t.charAt(t.length - 1) && (t += "."),
                        t && u.ensureValidHostname(t),
                        (this._parts.hostname = this._parts.hostname.replace(
                            n,
                            t
                        )),
                        this.build(!e),
                        this
                    )
                if (!this._parts.hostname || this.is("IP")) return ""
                var n = this._parts.hostname.length - this.domain().length - 1
                return this._parts.hostname.substring(0, n) || ""
            }),
            (m.domain = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (
                    ("boolean" == typeof t && ((e = t), (t = void 0)),
                    void 0 === t)
                ) {
                    if (!this._parts.hostname || this.is("IP")) return ""
                    var n = this._parts.hostname.match(/\./g)
                    return n && n.length < 2
                        ? this._parts.hostname
                        : ((n =
                              this._parts.hostname.length -
                              this.tld(e).length -
                              1),
                          (n =
                              this._parts.hostname.lastIndexOf(".", n - 1) + 1),
                          this._parts.hostname.substring(n) || "")
                }
                if (!t) throw new TypeError("cannot set domain empty")
                return (
                    u.ensureValidHostname(t),
                    !this._parts.hostname || this.is("IP")
                        ? (this._parts.hostname = t)
                        : ((n = new RegExp(i(this.domain()) + "$")),
                          (this._parts.hostname = this._parts.hostname.replace(
                              n,
                              t
                          ))),
                    this.build(!e),
                    this
                )
            }),
            (m.tld = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (
                    ("boolean" == typeof t && ((e = t), (t = void 0)),
                    void 0 === t)
                ) {
                    if (!this._parts.hostname || this.is("IP")) return ""
                    var n = this._parts.hostname.lastIndexOf("."),
                        n = this._parts.hostname.substring(n + 1)
                    return (
                        (!0 !== e &&
                            c &&
                            c.list[n.toLowerCase()] &&
                            c.get(this._parts.hostname)) ||
                        n
                    )
                }
                if (!t) throw new TypeError("cannot set TLD empty")
                if (t.match(/[^a-zA-Z0-9-]/)) {
                    if (!c || !c.is(t))
                        throw new TypeError(
                            'TLD "' +
                                t +
                                '" contains characters other than [A-Z0-9]'
                        )
                    ;(n = new RegExp(i(this.tld()) + "$")),
                        (this._parts.hostname = this._parts.hostname.replace(
                            n,
                            t
                        ))
                } else {
                    if (!this._parts.hostname || this.is("IP"))
                        throw new ReferenceError(
                            "cannot set TLD on non-domain host"
                        )
                    ;(n = new RegExp(i(this.tld()) + "$")),
                        (this._parts.hostname = this._parts.hostname.replace(
                            n,
                            t
                        ))
                }
                return this.build(!e), this
            }),
            (m.directory = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (void 0 !== t && !0 !== t)
                    return (
                        (n = this._parts.path.length - this.filename().length),
                        (n = this._parts.path.substring(0, n)),
                        (n = new RegExp("^" + i(n))),
                        this.is("relative") ||
                            ("/" !== (t = t || "/").charAt(0) && (t = "/" + t)),
                        t && "/" !== t.charAt(t.length - 1) && (t += "/"),
                        (t = u.recodePath(t)),
                        (this._parts.path = this._parts.path.replace(n, t)),
                        this.build(!e),
                        this
                    )
                if (!this._parts.path && !this._parts.hostname) return ""
                if ("/" === this._parts.path) return "/"
                var n = this._parts.path.length - this.filename().length - 1,
                    n =
                        this._parts.path.substring(0, n) ||
                        (this._parts.hostname ? "/" : "")
                return t ? u.decodePath(n) : n
            }),
            (m.filename = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (void 0 === t || !0 === t) {
                    if (!this._parts.path || "/" === this._parts.path) return ""
                    var n = this._parts.path.lastIndexOf("/"),
                        n = this._parts.path.substring(n + 1)
                    return t ? u.decodePathSegment(n) : n
                }
                ;(n = !1),
                    "/" === t.charAt(0) && (t = t.substring(1)),
                    t.match(/\.?\//) && (n = !0)
                var r = new RegExp(i(this.filename()) + "$")
                return (
                    (t = u.recodePath(t)),
                    (this._parts.path = this._parts.path.replace(r, t)),
                    n ? this.normalizePath(e) : this.build(!e),
                    this
                )
            }),
            (m.suffix = function (t, e) {
                if (this._parts.urn) return void 0 === t ? "" : this
                if (void 0 === t || !0 === t) {
                    if (!this._parts.path || "/" === this._parts.path) return ""
                    var n = this.filename(),
                        r = n.lastIndexOf(".")
                    return -1 === r
                        ? ""
                        : ((n = n.substring(r + 1)),
                          (n = /^[a-z0-9%]+$/i.test(n) ? n : ""),
                          t ? u.decodePathSegment(n) : n)
                }
                if (
                    ("." === t.charAt(0) && (t = t.substring(1)),
                    (n = this.suffix()))
                )
                    r = t
                        ? new RegExp(i(n) + "$")
                        : new RegExp(i("." + n) + "$")
                else {
                    if (!t) return this
                    this._parts.path += "." + u.recodePath(t)
                }
                return (
                    r &&
                        ((t = u.recodePath(t)),
                        (this._parts.path = this._parts.path.replace(r, t))),
                    this.build(!e),
                    this
                )
            }),
            (m.segment = function (t, e, n) {
                var r = this._parts.urn ? ":" : "/",
                    i = "/" === (o = this.path()).substring(0, 1),
                    o = o.split(r)
                if (
                    (void 0 !== t &&
                        "number" != typeof t &&
                        ((n = e), (e = t), (t = void 0)),
                    void 0 !== t && "number" != typeof t)
                )
                    throw Error(
                        'Bad segment "' + t + '", must be 0-based integer'
                    )
                if (
                    (i && o.shift(),
                    t < 0 && (t = Math.max(o.length + t, 0)),
                    void 0 === e)
                )
                    return void 0 === t ? o : o[t]
                if (null === t || void 0 === o[t])
                    if (l(e)) {
                        ;(o = []), (t = 0)
                        for (var s = e.length; t < s; t++)
                            (e[t].length ||
                                (o.length && o[o.length - 1].length)) &&
                                (o.length && !o[o.length - 1].length && o.pop(),
                                o.push(e[t]))
                    } else
                        (!e && "string" != typeof e) ||
                            ("" === o[o.length - 1]
                                ? (o[o.length - 1] = e)
                                : o.push(e))
                else e ? (o[t] = e) : o.splice(t, 1)
                return i && o.unshift(""), this.path(o.join(r), n)
            }),
            (m.segmentCoded = function (t, e, n) {
                var r, i
                if (
                    ("number" != typeof t && ((n = e), (e = t), (t = void 0)),
                    void 0 === e)
                ) {
                    if (l((t = this.segment(t, e, n))))
                        for (r = 0, i = t.length; r < i; r++)
                            t[r] = u.decode(t[r])
                    else t = void 0 !== t ? u.decode(t) : void 0
                    return t
                }
                if (l(e))
                    for (r = 0, i = e.length; r < i; r++) e[r] = u.decode(e[r])
                else
                    e =
                        "string" == typeof e || e instanceof String
                            ? u.encode(e)
                            : e
                return this.segment(t, e, n)
            })
        var S = m.query
        return (
            (m.query = function (t, e) {
                if (!0 === t)
                    return u.parseQuery(
                        this._parts.query,
                        this._parts.escapeQuerySpace
                    )
                if ("function" != typeof t)
                    return void 0 !== t && "string" != typeof t
                        ? ((this._parts.query = u.buildQuery(
                              t,
                              this._parts.duplicateQueryParameters,
                              this._parts.escapeQuerySpace
                          )),
                          this.build(!e),
                          this)
                        : S.call(this, t, e)
                var n = u.parseQuery(
                        this._parts.query,
                        this._parts.escapeQuerySpace
                    ),
                    r = t.call(this, n)
                return (
                    (this._parts.query = u.buildQuery(
                        r || n,
                        this._parts.duplicateQueryParameters,
                        this._parts.escapeQuerySpace
                    )),
                    this.build(!e),
                    this
                )
            }),
            (m.setQuery = function (t, e, n) {
                var r = u.parseQuery(
                    this._parts.query,
                    this._parts.escapeQuerySpace
                )
                if ("string" == typeof t || t instanceof String)
                    r[t] = void 0 !== e ? e : null
                else {
                    if ("object" != typeof t)
                        throw new TypeError(
                            "URI.addQuery() accepts an object, string as the name parameter"
                        )
                    for (var i in t) v.call(t, i) && (r[i] = t[i])
                }
                return (
                    (this._parts.query = u.buildQuery(
                        r,
                        this._parts.duplicateQueryParameters,
                        this._parts.escapeQuerySpace
                    )),
                    "string" != typeof t && (n = e),
                    this.build(!n),
                    this
                )
            }),
            (m.addQuery = function (t, e, n) {
                var r = u.parseQuery(
                    this._parts.query,
                    this._parts.escapeQuerySpace
                )
                return (
                    u.addQuery(r, t, void 0 === e ? null : e),
                    (this._parts.query = u.buildQuery(
                        r,
                        this._parts.duplicateQueryParameters,
                        this._parts.escapeQuerySpace
                    )),
                    "string" != typeof t && (n = e),
                    this.build(!n),
                    this
                )
            }),
            (m.removeQuery = function (t, e, n) {
                var r = u.parseQuery(
                    this._parts.query,
                    this._parts.escapeQuerySpace
                )
                return (
                    u.removeQuery(r, t, e),
                    (this._parts.query = u.buildQuery(
                        r,
                        this._parts.duplicateQueryParameters,
                        this._parts.escapeQuerySpace
                    )),
                    "string" != typeof t && (n = e),
                    this.build(!n),
                    this
                )
            }),
            (m.hasQuery = function (t, e, n) {
                var r = u.parseQuery(
                    this._parts.query,
                    this._parts.escapeQuerySpace
                )
                return u.hasQuery(r, t, e, n)
            }),
            (m.setSearch = m.setQuery),
            (m.addSearch = m.addQuery),
            (m.removeSearch = m.removeQuery),
            (m.hasSearch = m.hasQuery),
            (m.normalize = function () {
                return this._parts.urn
                    ? this.normalizeProtocol(!1)
                          .normalizePath(!1)
                          .normalizeQuery(!1)
                          .normalizeFragment(!1)
                          .build()
                    : this.normalizeProtocol(!1)
                          .normalizeHostname(!1)
                          .normalizePort(!1)
                          .normalizePath(!1)
                          .normalizeQuery(!1)
                          .normalizeFragment(!1)
                          .build()
            }),
            (m.normalizeProtocol = function (t) {
                return (
                    "string" == typeof this._parts.protocol &&
                        ((this._parts.protocol =
                            this._parts.protocol.toLowerCase()),
                        this.build(!t)),
                    this
                )
            }),
            (m.normalizeHostname = function (t) {
                return (
                    this._parts.hostname &&
                        (this.is("IDN") && a
                            ? (this._parts.hostname = a.toASCII(
                                  this._parts.hostname
                              ))
                            : this.is("IPv6") &&
                              e &&
                              (this._parts.hostname = e.best(
                                  this._parts.hostname
                              )),
                        (this._parts.hostname =
                            this._parts.hostname.toLowerCase()),
                        this.build(!t)),
                    this
                )
            }),
            (m.normalizePort = function (t) {
                return (
                    "string" == typeof this._parts.protocol &&
                        this._parts.port ===
                            u.defaultPorts[this._parts.protocol] &&
                        ((this._parts.port = null), this.build(!t)),
                    this
                )
            }),
            (m.normalizePath = function (t) {
                var e = this._parts.path
                if (!e) return this
                if (this._parts.urn)
                    return (
                        (this._parts.path = u.recodeUrnPath(this._parts.path)),
                        this.build(!t),
                        this
                    )
                if ("/" === this._parts.path) return this
                var n,
                    r,
                    i,
                    o = ""
                for (
                    "/" !== e.charAt(0) && ((n = !0), (e = "/" + e)),
                        e = e
                            .replace(/(\/(\.\/)+)|(\/\.$)/g, "/")
                            .replace(/\/{2,}/g, "/"),
                        n &&
                            (o = e.substring(1).match(/^(\.\.\/)+/) || "") &&
                            (o = o[0]);
                    -1 !== (r = e.indexOf("/.."));

                )
                    e =
                        0 !== r
                            ? (-1 ===
                                  (i = e.substring(0, r).lastIndexOf("/")) &&
                                  (i = r),
                              e.substring(0, i) + e.substring(r + 3))
                            : e.substring(3)
                return (
                    n && this.is("relative") && (e = o + e.substring(1)),
                    (e = u.recodePath(e)),
                    (this._parts.path = e),
                    this.build(!t),
                    this
                )
            }),
            (m.normalizePathname = m.normalizePath),
            (m.normalizeQuery = function (t) {
                return (
                    "string" == typeof this._parts.query &&
                        (this._parts.query.length
                            ? this.query(
                                  u.parseQuery(
                                      this._parts.query,
                                      this._parts.escapeQuerySpace
                                  )
                              )
                            : (this._parts.query = null),
                        this.build(!t)),
                    this
                )
            }),
            (m.normalizeFragment = function (t) {
                return (
                    this._parts.fragment ||
                        ((this._parts.fragment = null), this.build(!t)),
                    this
                )
            }),
            (m.normalizeSearch = m.normalizeQuery),
            (m.normalizeHash = m.normalizeFragment),
            (m.iso8859 = function () {
                var t = u.encode,
                    e = u.decode
                ;(u.encode = escape), (u.decode = decodeURIComponent)
                try {
                    this.normalize()
                } finally {
                    ;(u.encode = t), (u.decode = e)
                }
                return this
            }),
            (m.unicode = function () {
                var t = u.encode,
                    e = u.decode
                ;(u.encode = d), (u.decode = unescape)
                try {
                    this.normalize()
                } finally {
                    ;(u.encode = t), (u.decode = e)
                }
                return this
            }),
            (m.readable = function () {
                var t = this.clone()
                t.username("").password("").normalize()
                var e = ""
                if (
                    (t._parts.protocol && (e += t._parts.protocol + "://"),
                    t._parts.hostname &&
                        (t.is("punycode") && a
                            ? ((e += a.toUnicode(t._parts.hostname)),
                              t._parts.port && (e += ":" + t._parts.port))
                            : (e += t.host())),
                    t._parts.hostname &&
                        t._parts.path &&
                        "/" !== t._parts.path.charAt(0) &&
                        (e += "/"),
                    (e += t.path(!0)),
                    t._parts.query)
                ) {
                    for (
                        var n = "",
                            r = 0,
                            i = t._parts.query.split("&"),
                            o = i.length;
                        r < o;
                        r++
                    ) {
                        var s = (i[r] || "").split("="),
                            n =
                                n +
                                ("&" +
                                    u
                                        .decodeQuery(
                                            s[0],
                                            this._parts.escapeQuerySpace
                                        )
                                        .replace(/&/g, "%26"))
                        void 0 !== s[1] &&
                            (n +=
                                "=" +
                                u
                                    .decodeQuery(
                                        s[1],
                                        this._parts.escapeQuerySpace
                                    )
                                    .replace(/&/g, "%26"))
                    }
                    e += "?" + n.substring(1)
                }
                return e + u.decodeQuery(t.hash(), !0)
            }),
            (m.absoluteTo = function (t) {
                var e,
                    n,
                    r = this.clone(),
                    i = ["protocol", "username", "password", "hostname", "port"]
                if (this._parts.urn)
                    throw Error(
                        "URNs do not have any generally defined hierarchical components"
                    )
                if (
                    (t instanceof u || (t = new u(t)),
                    r._parts.protocol ||
                        (r._parts.protocol = t._parts.protocol),
                    this._parts.hostname)
                )
                    return r
                for (e = 0; (n = i[e]); e++) r._parts[n] = t._parts[n]
                return (
                    r._parts.path
                        ? ".." === r._parts.path.substring(-2) &&
                          (r._parts.path += "/")
                        : ((r._parts.path = t._parts.path),
                          r._parts.query || (r._parts.query = t._parts.query)),
                    "/" !== r.path().charAt(0) &&
                        ((i = (i = t.directory())
                            ? i
                            : 0 === t.path().indexOf("/")
                            ? "/"
                            : ""),
                        (r._parts.path = (i ? i + "/" : "") + r._parts.path),
                        r.normalizePath()),
                    r.build(),
                    r
                )
            }),
            (m.relativeTo = function (t) {
                var e,
                    n,
                    r,
                    i,
                    o = this.clone().normalize()
                if (o._parts.urn)
                    throw Error(
                        "URNs do not have any generally defined hierarchical components"
                    )
                if (
                    ((t = new u(t).normalize()),
                    (e = o._parts),
                    (n = t._parts),
                    (r = o.path()),
                    (i = t.path()),
                    "/" !== r.charAt(0))
                )
                    throw Error("URI is already relative")
                if ("/" !== i.charAt(0))
                    throw Error(
                        "Cannot calculate a URI relative to another relative URI"
                    )
                return (
                    e.protocol === n.protocol && (e.protocol = null),
                    e.username !== n.username ||
                    e.password !== n.password ||
                    null !== e.protocol ||
                    null !== e.username ||
                    null !== e.password ||
                    e.hostname !== n.hostname ||
                    e.port !== n.port
                        ? o.build()
                        : ((e.hostname = null),
                          (e.port = null),
                          r === i
                              ? (e.path = "")
                              : (t = u.commonPath(o.path(), t.path())) &&
                                ((n = n.path
                                    .substring(t.length)
                                    .replace(/[^\/]*$/, "")
                                    .replace(/.*?\//g, "../")),
                                (e.path = n + e.path.substring(t.length))),
                          o.build())
                )
            }),
            (m.equals = function (t) {
                var e = this.clone()
                t = new u(t)
                var n,
                    r = {},
                    i = {},
                    o = {}
                if (
                    (e.normalize(),
                    t.normalize(),
                    e.toString() === t.toString())
                )
                    return !0
                if (
                    ((r = e.query()),
                    (i = t.query()),
                    e.query(""),
                    t.query(""),
                    e.toString() !== t.toString() || r.length !== i.length)
                )
                    return !1
                for (n in ((r = u.parseQuery(r, this._parts.escapeQuerySpace)),
                (i = u.parseQuery(i, this._parts.escapeQuerySpace)),
                r))
                    if (v.call(r, n)) {
                        if (l(r[n])) {
                            if (!h(r[n], i[n])) return !1
                        } else if (r[n] !== i[n]) return !1
                        o[n] = !0
                    }
                for (n in i) if (v.call(i, n) && !o[n]) return !1
                return !0
            }),
            (m.duplicateQueryParameters = function (t) {
                return (this._parts.duplicateQueryParameters = !!t), this
            }),
            (m.escapeQuerySpace = function (t) {
                return (this._parts.escapeQuerySpace = !!t), this
            }),
            u
        )
    }),
    (function (t) {
        "function" == typeof define && define.amd
            ? define(
                  "object" != typeof document ||
                      "loading" !== document.readyState
                      ? []
                      : "html5-history-api",
                  t
              )
            : t()
    })(function () {
        var p = !0,
            h = null,
            d = !1
        function i(t, e) {
            var n = v.history !== T
            n && (v.history = T), t.apply(T, e), n && (v.history = C)
        }
        function f() {}
        function a(t, e, n) {
            t == h || "" === t || e
                ? ((t = e ? t : x.href),
                  (k && !n) ||
                      ((t = t.replace(/^[^#]*/, "") || "#"),
                      (t =
                          x.protocol.replace(/:.*$|$/, ":") +
                          "//" +
                          x.host +
                          O.basepath +
                          t.replace(RegExp("^#[/]?(?:" + O.type + ")?"), ""))))
                : ((e = a()),
                  (r = y.getElementsByTagName("base")[0]),
                  !n &&
                      r &&
                      r.getAttribute("href") &&
                      ((r.href = r.href), (e = a(r.href, h, p))),
                  (n = e.d),
                  (r = e.h),
                  (t = /^(?:\w+\:)?\/\//.test((t = "" + t))
                      ? 0 === t.indexOf("/")
                          ? r + t
                          : t
                      : r +
                        "//" +
                        e.g +
                        (0 === t.indexOf("/")
                            ? t
                            : 0 === t.indexOf("?")
                            ? n + t
                            : 0 === t.indexOf("#")
                            ? n + e.e + t
                            : n.replace(/[^\/]+$/g, "") + t))),
                (R.href = t)
            var e =
                    (t =
                        /(?:(\w+\:))?(?:\/\/(?:[^@]*@)?([^\/:\?#]+)(?::([0-9]+))?)?([^\?#]*)(?:(\?[^#]+)|\?)?(?:(#.*))?/.exec(
                            R.href
                        ))[2] + (t[3] ? ":" + t[3] : ""),
                n = t[4] || "/",
                r = t[5] || "",
                i = ("#" !== t[6] && t[6]) || "",
                o = n + r + i,
                s = n.replace(RegExp("^" + O.basepath, "i"), O.type) + r
            return {
                b: t[1] + "//" + e + o,
                h: t[1],
                g: e,
                i: t[2],
                k: t[3] || "",
                d: n,
                e: r,
                a: i,
                c: o,
                j: s,
                f: s + i,
            }
        }
        function s(e, n, r, t) {
            var i = 0
            r || ((r = { set: f }), (i = 1))
            var o = !r.set,
                s = !r.get,
                a = {
                    configurable: p,
                    set: function () {
                        o = 1
                    },
                    get: function () {
                        s = 1
                    },
                }
            try {
                _(e, n, a), (e[n] = e[n]), _(e, n, r)
            } catch (t) {}
            if (
                !(
                    (o && s) ||
                    (e.__defineGetter__ &&
                        (e.__defineGetter__(n, a.get),
                        e.__defineSetter__(n, a.set),
                        (e[n] = e[n]),
                        r.get && e.__defineGetter__(n, r.get),
                        r.set && e.__defineSetter__(n, r.set)),
                    o && s)
                )
            ) {
                if (i) return d
                if (e === v) {
                    try {
                        var l = e[n]
                        e[n] = h
                    } catch (t) {}
                    if ("execScript" in v)
                        v.execScript("Public " + n, "VBScript"),
                            v.execScript("var " + n + ";", "JavaScript")
                    else
                        try {
                            _(e, n, { value: f })
                        } catch (t) {
                            "onpopstate" === n &&
                                (j(
                                    "popstate",
                                    (r = function () {
                                        q("popstate", r, d)
                                        var t = e.onpopstate
                                        ;(e.onpopstate = h),
                                            setTimeout(function () {
                                                e.onpopstate = t
                                            }, 1)
                                    }),
                                    d
                                ),
                                (F = 0))
                        }
                    e[n] = l
                } else
                    try {
                        try {
                            var c = b.create(e)
                            for (var u in (_(
                                b.getPrototypeOf(c) === e ? c : e,
                                n,
                                r
                            ),
                            e))
                                "function" == typeof e[u] &&
                                    (c[u] = e[u].bind(e))
                            try {
                                t.call(c, c, e)
                            } catch (t) {}
                            e = c
                        } catch (t) {
                            _(e.constructor.prototype, n, r)
                        }
                    } catch (t) {
                        return d
                    }
            }
            return e
        }
        function r(t, e) {
            var n = ("" + ("string" == typeof t ? t : t.type)).replace(
                    /^on/,
                    ""
                ),
                r = M[n]
            if (r) {
                if ((e = "string" == typeof t ? e : t).target == h)
                    for (
                        var i = [
                            "target",
                            "currentTarget",
                            "srcElement",
                            "type",
                        ];
                        (t = i.pop());

                    )
                        e = s(e, t, {
                            get:
                                "type" === t
                                    ? function () {
                                          return n
                                      }
                                    : function () {
                                          return v
                                      },
                        })
                F &&
                    (
                        ("popstate" === n ? v.onpopstate : v.onhashchange) || f
                    ).call(v, e)
                for (var i = 0, o = r.length; i < o; i++) r[i].call(v, e)
                return p
            }
            return I(t, e)
        }
        function o() {
            var t = y.createEvent
                ? y.createEvent("Event")
                : y.createEventObject()
            t.initEvent ? t.initEvent("popstate", d, d) : (t.type = "popstate"),
                (t.state = C.state),
                r(t)
        }
        function l(t, e, n, r) {
            k
                ? (L = x.href)
                : (0 === U && (U = 2),
                  (e = a(e, 2 === U && -1 !== ("" + e).indexOf("#"))).c !==
                      a().c &&
                      ((L = r), n ? x.replace("#" + e.f) : (x.hash = e.f))),
                !A && t && (B[x.href] = t),
                (Q = d)
        }
        function c(t) {
            var e,
                n = L
            ;(L = x.href),
                n &&
                    (H !== x.href && o(),
                    (t = t || v.event),
                    (n = a(n, p)),
                    (e = a()),
                    t.oldURL || ((t.oldURL = n.b), (t.newURL = e.b)),
                    n.a !== e.a && r(t))
        }
        function u(t) {
            setTimeout(function () {
                j(
                    "popstate",
                    function (t) {
                        ;(H = x.href),
                            A ||
                                (t = s(t, "state", {
                                    get: function () {
                                        return C.state
                                    },
                                })),
                            r(t)
                    },
                    d
                )
            }, 0),
                !k &&
                    t !== p &&
                    "location" in C &&
                    (m($.hash), Q && ((Q = d), o()))
        }
        function g(t) {
            var e
            t: {
                for (e = (t = t || v.event).target || t.srcElement; e; ) {
                    if ("A" === e.nodeName) break t
                    e = e.parentNode
                }
                e = void 0
            }
            var n =
                "defaultPrevented" in t
                    ? t.defaultPrevented
                    : t.returnValue === d
            e &&
                "A" === e.nodeName &&
                !n &&
                ((n = a()),
                (e = a(e.getAttribute("href", 2))),
                n.b.split("#").shift() === e.b.split("#").shift() &&
                    e.a &&
                    (n.a !== e.a && ($.hash = e.a),
                    m(e.a),
                    t.preventDefault
                        ? t.preventDefault()
                        : (t.returnValue = d)))
        }
        function m(t) {
            var e = y.getElementById((t = (t || "").replace(/^#/, "")))
            e &&
                e.id === t &&
                "A" === e.nodeName &&
                ((t = e.getBoundingClientRect()),
                v.scrollTo(
                    n.scrollLeft || 0,
                    t.top + (n.scrollTop || 0) - (n.clientTop || 0)
                ))
        }
        var v = ("object" == typeof window ? window : this) || {}
        if (!v.history || "emulate" in v.history) return v.history
        var y = v.document,
            n = y.documentElement,
            b = v.Object,
            w = v.JSON,
            x = v.location,
            T = v.history,
            C = T,
            S = T.pushState,
            E = T.replaceState,
            k = !!S,
            A = "state" in T,
            _ = b.defineProperty,
            $ = s({}, "t") ? {} : y.createElement("a"),
            N = "",
            D = v.addEventListener
                ? "addEventListener"
                : ((N = "on"), "attachEvent"),
            t = v.removeEventListener ? "removeEventListener" : "detachEvent",
            e = v.dispatchEvent ? "dispatchEvent" : "fireEvent",
            j = v[D],
            q = v[t],
            I = v[e],
            O = { basepath: "/", redirect: 0, type: "/", init: 0 },
            P = "__historyAPI__",
            R = y.createElement("a"),
            L = x.href,
            H = "",
            F = 1,
            Q = d,
            U = 0,
            B = {},
            M = {},
            W = y.title,
            z = { onhashchange: h, onpopstate: h },
            V = {
                setup: function (t, e, n) {
                    ;(O.basepath = ("" + (t == h ? O.basepath : t)).replace(
                        /(?:^|\/)[^\/]*$/,
                        "/"
                    )),
                        (O.type = e == h ? O.type : e),
                        (O.redirect = n == h ? O.redirect : !!n)
                },
                redirect: function (t, e) {
                    var n, r
                    C.setup(e, t),
                        (e = O.basepath),
                        v.top == v.self &&
                            ((n = a(h, d, p).c),
                            (r = x.pathname + x.search),
                            k
                                ? ((r = r.replace(/([^\/])$/, "$1/")),
                                  n != e &&
                                      RegExp("^" + e + "$", "i").test(r) &&
                                      x.replace(n))
                                : r != e &&
                                  ((r = r.replace(/([^\/])\?/, "$1/?")),
                                  RegExp("^" + e, "i").test(r) &&
                                      x.replace(
                                          e +
                                              "#" +
                                              r.replace(
                                                  RegExp("^" + e, "i"),
                                                  O.type
                                              ) +
                                              x.hash
                                      )))
                },
                pushState: function (t, e, n) {
                    var r = y.title
                    W != h && (y.title = W),
                        S && i(S, arguments),
                        l(t, n),
                        (y.title = r),
                        (W = e)
                },
                replaceState: function (t, e, n) {
                    var r = y.title
                    W != h && (y.title = W),
                        delete B[x.href],
                        E && i(E, arguments),
                        l(t, n, p),
                        (y.title = r),
                        (W = e)
                },
                location: {
                    set: function (t) {
                        0 === U && (U = 1), (v.location = t)
                    },
                    get: function () {
                        return 0 === U && (U = 1), k ? x : $
                    },
                },
                state: {
                    get: function () {
                        return B[x.href] || h
                    },
                },
            },
            X = {
                assign: function (t) {
                    0 === ("" + t).indexOf("#") ? l(h, t) : x.assign(t)
                },
                reload: function () {
                    x.reload()
                },
                replace: function (t) {
                    0 === ("" + t).indexOf("#") ? l(h, t, p) : x.replace(t)
                },
                toString: function () {
                    return this.href
                },
                href: {
                    get: function () {
                        return a().b
                    },
                },
                protocol: h,
                host: h,
                hostname: h,
                port: h,
                pathname: {
                    get: function () {
                        return a().d
                    },
                },
                search: {
                    get: function () {
                        return a().e
                    },
                },
                hash: {
                    set: function (t) {
                        l(h, ("" + t).replace(/^(#|)/, "#"), d, L)
                    },
                    get: function () {
                        return a().a
                    },
                },
            }
        return (function () {
            var t = y.getElementsByTagName("script")
            ;(-1 !== (t = (t[t.length - 1] || {}).src || "").indexOf("?")
                ? t.split("?").pop()
                : ""
            ).replace(/(\w+)(?:=([^&]*))?/g, function (t, e, n) {
                O[e] = (n || "").replace(/^(0|false)$/, "")
            }),
                j(N + "hashchange", c, d)
            var n = [X, $, z, v, V, C]
            A && delete V.state
            for (var r = 0; r < n.length; r += 2)
                for (var e in n[r])
                    if (n[r].hasOwnProperty(e))
                        if ("function" == typeof n[r][e]) n[r + 1][e] = n[r][e]
                        else {
                            if (
                                ((t = (function (e, n, t) {
                                    return (
                                        (e = e === X ? x : e),
                                        ((t = t || {}).set =
                                            t.set ||
                                            function (t) {
                                                e[n] = t
                                            }),
                                        (t.get =
                                            t.get ||
                                            function () {
                                                return e[n]
                                            }),
                                        t
                                    )
                                })(n[r], e, n[r][e])),
                                !s(n[r + 1], e, t, function (t, e) {
                                    e === C && (v.history = C = n[r + 1] = t)
                                }))
                            )
                                return q(N + "hashchange", c, d), d
                            n[r + 1] === v && (M[e] = M[e.substr(2)] = [])
                        }
            return (
                C.setup(),
                O.redirect && C.redirect(),
                O.init && (U = 1),
                !A &&
                    w &&
                    (function () {
                        var e
                        try {
                            ;(e = v.sessionStorage).setItem(P + "t", "1"),
                                e.removeItem(P + "t")
                        } catch (t) {
                            e = {
                                getItem: function (t) {
                                    return (
                                        (1 <
                                            (t = y.cookie.split(t + "="))
                                                .length &&
                                            t.pop().split(";").shift()) ||
                                        "null"
                                    )
                                },
                                setItem: function (t) {
                                    var e = {}
                                    ;(e[x.href] = C.state) &&
                                        (y.cookie = t + "=" + w.stringify(e))
                                },
                            }
                        }
                        try {
                            B = w.parse(e.getItem(P)) || {}
                        } catch (t) {
                            B = {}
                        }
                        j(
                            N + "unload",
                            function () {
                                e.setItem(P, w.stringify(B))
                            },
                            d
                        )
                    })(),
                k || y[D](N + "click", g, d),
                "complete" === y.readyState
                    ? u(p)
                    : (k || a().c === O.basepath || (Q = p),
                      j(N + "load", u, d)),
                p
            )
        })()
            ? ((C.emulate = !k),
              (v[D] = function (t, e, n) {
                  t in M
                      ? M[t].push(e)
                      : 3 < arguments.length
                      ? j(t, e, n, arguments[3])
                      : j(t, e, n)
              }),
              (v[t] = function (t, e, n) {
                  var r = M[t]
                  if (r) {
                      for (t = r.length; t--; )
                          if (r[t] === e) {
                              r.splice(t, 1)
                              break
                          }
                  } else q(t, e, n)
              }),
              (v[e] = r),
              C)
            : void 0
    })
var addclass = function (t, e) {
        t.classList ? t.classList.add(e) : (t.className += " " + e)
    },
    remclass = function (t, e) {
        t.classList
            ? t.classList.remove(e)
            : (t.className = t.className.replace(
                  new RegExp(
                      "(^|\\b)" + e.split(" ").join("|") + "(\\b|$)",
                      "gi"
                  ),
                  " "
              ))
    },
    hasclass = function (t, e) {
        return t.classList
            ? t.classList.contains(e)
            : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className)
    }
document.addEventListener("DOMContentLoaded", function () {
    var a = document.createElement("a")
    a.innerHTML =
        '<svg aria-hidden="true" class="i-share"><use xlink:href="assets/figures/icons.svg#i-share"></use></svg> SHARE'
    var l = document.createElement("div")
    addclass(l, "permalink")
    var c = document.createElement("div")
    addclass(c, "sharebox")
    var u = window.location.origin + window.location.pathname,
        t = document.querySelectorAll(".sc-wrapper footer a")
    Array.prototype.forEach.call(t, function (t, e) {
        var n = a.cloneNode(!0),
            r = t.parentNode.parentNode.id
        n.setAttribute("href", "#" + r),
            n.setAttribute(
                "aria-label",
                "Share Link to the section “" +
                    t.parentNode.parentNode.querySelector("h4[id]")
                        .textContent +
                    "”"
            )
        var i =
                '<p><label>Link to this section:<input type="url" value="%s" readonly> Shortcut to copy the link: <kbd>ctrl</kbd>+<kbd>C</kbd> <em>or</em> <kbd>⌘</kbd><kbd>C</kbd></label></p><p><a href="mailto:?subject=Web%20Accessibility%20–%20How%20to%20Meet%20WCAG&body=Hi!%0AYou%20might%20be%20interested%20in%20this%20section%20of%20the%20Web%20Content%20Accessibility%20Guidelines%20(WCAG)%3A%0A%0A%s">E-mail a link to this section</a><button>Close</button></p>'
                    .replace("%s", u + "#" + r)
                    .replace("%s", u + "#" + r),
            o = c.cloneNode(!0)
        o.innerHTML = i
        var s = l.cloneNode(!0)
        s.appendChild(n),
            s.appendChild(o),
            n.addEventListener("click", function (t) {
                var e = this.nextSibling,
                    n = e.querySelector("input")
                hasclass(e, "open")
                    ? remclass(e, "open")
                    : (addclass(e, "open"), n.select(), n.focus()),
                    t.preventDefault()
            }),
            t.parentNode.insertBefore(s, t)
    })
    var e = document.querySelectorAll(".sharebox button")
    Array.prototype.forEach.call(e, function (n, t) {
        n.addEventListener("click", function () {
            for (
                var t = document.querySelectorAll(".sharebox.open"),
                    e = t.length - 1;
                0 <= e;
                e--
            )
                remclass(t[e], "open")
            n.parentNode.parentNode.parentNode.querySelector("a").focus()
        })
    })
}),
    window.matchMedia ||
        (window.matchMedia = (function () {
            "use strict"
            var n,
                t,
                r,
                e = window.styleMedia || window.media
            return (
                e ||
                    ((n = document.createElement("style")),
                    (t = document.getElementsByTagName("script")[0]),
                    (r = null),
                    (n.type = "text/css"),
                    (n.id = "matchmediajs-test"),
                    t.parentNode.insertBefore(n, t),
                    (r =
                        ("getComputedStyle" in window &&
                            window.getComputedStyle(n, null)) ||
                        n.currentStyle),
                    (e = {
                        matchMedium: function (t) {
                            var e =
                                "@media " +
                                t +
                                "{ #matchmediajs-test { width: 1px; } }"
                            return (
                                n.styleSheet
                                    ? (n.styleSheet.cssText = e)
                                    : (n.textContent = e),
                                "1px" === r.width
                            )
                        },
                    })),
                function (t) {
                    return {
                        matches: e.matchMedium(t || "all"),
                        media: t || "all",
                    }
                }
            )
        })()),
    jQuery(document).ready(function (v) {
        function s() {
            return new URI(window.history.location || window.location)
        }
        var t,
            n = !1
        function y(t, e) {
            if (t.length < 3) return t.join(" " + e + " ")
            for (var n = [], r = t.length - 2; 0 <= r; r--) n[r] = v.trim(t[r])
            return n.join(", ") + ", " + e + " " + v.trim(t[t.length - 1])
        }
        function b() {
            v(".maininner").addClass("loading"),
                v(".filter-status .loaded").hide(),
                v(".filter-status .loading").show()
        }
        function a(t) {
            n || (history.pushState(null, null, t), t.fragment("")),
                v("body").scrollspy({
                    target: ".overview.spy-active",
                    offset: v(".navrow").outerHeight() + 10,
                })
        }
        function r() {
            var t,
                e,
                n = s(),
                r = n.search(!0)
            r.hidesidebar &&
                (v(".sidebar").hide(),
                v(".mainrow").addClass("sidebar-hidden"),
                v("#showsidebars").show().focus()),
                r.currentsidebar &&
                    v("a[href=" + r.currentsidebar + "]").trigger("click"),
                r.tags &&
                    (v("#tags .btn")
                        .removeClass("btn-primary")
                        .addClass("btn-default")
                        .attr("aria-pressed", "false"),
                    v(
                        '#tags .btn[data-tag="' +
                            r.tags
                                .split(",")
                                .join('"], #tags .btn[data-tag="') +
                            '"]'
                    )
                        .addClass("btn-primary")
                        .removeClass("btn-default")
                        .attr("aria-pressed", !0)),
                r.levels &&
                    (v("#filter-levels input").prop("checked", !0),
                    v(
                        '#filter-levels input[value="' +
                            r.levels
                                .split(",")
                                .join('"], #filter-levels input[value="') +
                            '"]'
                    ).prop("checked", !1)),
                r.technologies &&
                    (v("#filter-technologies input").prop("checked", !0),
                    v(
                        '#filter-technologies input[value="' +
                            r.technologies
                                .split(",")
                                .join(
                                    '"], #filter-technologies input[value="'
                                ) +
                            '"]'
                    ).prop("checked", !1)),
                r.techniques &&
                    (v("#filter-techniques input").prop("checked", !0),
                    v(
                        '#filter-techniques input[value="' +
                            r.techniques
                                .split(",")
                                .join('"], #filter-techniques input[value="') +
                            '"]'
                    ).prop("checked", !1)),
                r.versions &&
                    v('#wcagver [value="' + r.versions + '"]').prop(
                        "selected",
                        !0
                    ),
                v(".btn-techniques").each(function (t, e) {
                    var n = v(e)
                    n.attr("data-expanded", "false"),
                        v("#" + n.attr("aria-controls")).removeClass("in")
                }),
                r.showtechniques &&
                    v(
                        '.btn-techniques[aria-controls="techniques-' +
                            r.showtechniques
                                .split(",")
                                .join(
                                    '"], .btn-techniques[aria-controls="techniques-'
                                ) +
                            '"]'
                    ).each(function (t, e) {
                        var n = v(e)
                        n.attr("data-expanded", "true"),
                            v("#" + n.attr("aria-controls")).addClass("in")
                    }),
                d(!!r.showtechniques),
                o(),
                c(),
                l(),
                i(),
                v("#tags button:disabled").first().addClass("first"),
                n.hash() &&
                    ((t = n.hash()).match(/(.*)-sufficient-head$/) ||
                    t.match(/(.*)-tech-optional-head$/) ||
                    t.match(/(.*)-failures-head$/)
                        ? (v('[data-historicalid="' + t + '"]')
                              .parents(".collapse")
                              .collapse("show"),
                          p(
                              v(
                                  '[data-historicalid="' +
                                      t.replace("#", "") +
                                      '"]'
                              )
                          ))
                        : (e = v('[data-alt-id~="' + t.replace("#", "") + '"]'))
                              .length
                        ? (p(e),
                          history.replaceState(null, null, "#" + e.attr("id")))
                        : p(v(t)))
        }
        function i() {
            var n,
                t = v("#tags .btn-primary:not(:disabled)"),
                e = v("#audiences input:checked"),
                r = v("#filter-levels input:not(:checked)")
            if (0 < t.length) {
                var i = [],
                    o = [],
                    s = []
                t.each(function (t, e) {
                    i.push(v(e).attr("data-tag"))
                }),
                    e.each(function (t, e) {
                        o.push(v(e).val())
                    })
                for (var a = o.length - 1; 0 <= a; a--)
                    for (var l = i.length - 1; 0 <= l; l--)
                        s.push(
                            ".sc-wrapper[data-tags-" + o[a] + "~=" + i[l] + "]"
                        )
                var c = s.join(", ")
                v(".sc-wrapper").removeClass("current"),
                    v(c).addClass("current"),
                    v("#deselecttags").prop("disabled", !1)
            } else v(".sc-wrapper").addClass("current"), v("#deselecttags").prop("disabled", !0)
            2 == r.length
                ? v("#filter-levels input:checked").prop("disabled", !0)
                : v("#filter-levels input:checked").prop("disabled", !1),
                0 < r.length
                    ? (v("#filter-levels button.filters").prop("disabled", !1),
                      r.each(function (t, n) {
                          v(".sc-wrapper.current").each(function (t, e) {
                              v(e).hasClass("filter-levels-" + v(n).val()) &&
                                  v(e).removeClass("current")
                          })
                      }))
                    : v("#filter-levels button.filters").prop("disabled", !0),
                v(".sc-wrapper").each(function (t, e) {
                    v(e).is(".current")
                        ? v(
                              '.overview [href="#' +
                                  v(e).find("h4").attr("id") +
                                  '"]'
                          )
                              .parent()
                              .show()
                        : v(
                              '.overview [href="#' +
                                  v(e).find("h4").attr("id") +
                                  '"]'
                          )
                              .parent()
                              .hide()
                }),
                v(".guideline").each(function (t, e) {
                    0 < v(e).has(".sc-wrapper.current").length
                        ? (v(e).find("> .panel-heading, > .panel-body").show(),
                          v(
                              '.overview [href="#' +
                                  v(e).find("h3").attr("id") +
                                  '"]'
                          )
                              .parent()
                              .show())
                        : (v(e).find("> .panel-heading, > .panel-body").hide(),
                          v(
                              '.overview [href="#' +
                                  v(e).find("h3").attr("id") +
                                  '"]'
                          )
                              .parent()
                              .hide())
                }),
                v(".principle + .guidelines").each(function (t, e) {
                    0 < v(e).has(".sc-wrapper.current").length
                        ? (v(e).prev().show(),
                          v(
                              '.overview [href="#' +
                                  v(e).prev().find("h2").attr("id") +
                                  '"]'
                          )
                              .parent()
                              .show())
                        : (v(e).prev().hide(),
                          v(
                              '.overview [href="#' +
                                  v(e).prev().find("h2").attr("id") +
                                  '"]'
                          )
                              .parent()
                              .hide())
                }),
                0 < v(".sc-wrapper:not(.current)").length
                    ? (v("#hiddensc").empty(),
                      v(
                          '<div class="panel-heading"><h2 style="margin: 0;">Filtered-Out Success Criteria <button class="clearall btn btn-info btn-sm" hidden="" style="display: inline-block;"><span class="glyphicon glyphicon-refresh"></span> Clear filters</button></h2></div><div class="panel-body"><p><strong>The following success criteria are not shown based on the selected version, tags, and/or filters:</strong></p></div>'
                      ).appendTo("#hiddensc"),
                      v('<div class="panel-body hiddensc-inner">').appendTo(
                          "#hiddensc"
                      ),
                      (n = v("<ul>")),
                      v(".sc-wrapper:not(.current) h4").each(function (t, e) {
                          n.append(
                              "<li>" +
                                  v(e).find("> strong").text() +
                                  " " +
                                  v(e).find("> span").text() +
                                  " " +
                                  v(e).parent().find(".newin21").text() +
                                  "</li>"
                          ).appendTo("#hiddensc .hiddensc-inner")
                      }),
                      v("#hiddensc, #hiddennav").show())
                    : v("#hiddensc, #hiddennav").hide(),
                u(),
                h()
        }
        function o() {
            v('.panel-body li:has(a[href*="/Techniques/"])').show()
            var t,
                n = [],
                e = v("#filter-technologies input:not(:checked)")
            0 < e.length
                ? (e.each(function (t, e) {
                      n.push(v(e).val())
                  }),
                  (t = n
                      .map(function (t) {
                          return '.panel-body li:has(a[href*="/' + t + '/"])'
                      })
                      .join(", ")),
                  v(t).hide(),
                  u(),
                  h(),
                  v("#filter-technologies button.filters").prop("disabled", !1))
                : v("#filter-technologies button.filters").prop("disabled", !0)
        }
        function l() {
            v("[data-versions]").hide(),
                v(".sc-wrapper.current").removeClass("current")
            var t = v("#wcagver").val()
            "2.1only" == t
                ? v('[data-versions="2.1 2.2 "]').show().addClass("current")
                : "2.2only" == t
                ? v('[data-versions="2.2 "]').show().addClass("current")
                : v('[data-versions*="' + t + '"]')
                      .show()
                      .addClass("current")
        }
        function c() {
            for (
                var t = v("#filter-techniques-content"),
                    e = [],
                    n = [],
                    r = t.find("input:checked"),
                    i = r.length - 1;
                0 <= i;
                i--
            )
                e.push(v(r[i]).val())
            var o =
                    '.techniques-button input[name$="' +
                    e.join('"], .techniques-button input[name$="') +
                    '"]',
                s = ".tbox-" + e.join(", .tbox-")
            v(o).prop("checked", !0), v(s).addClass("active")
            var a = t.find("input:not(:checked)")
            if (0 < a.length) {
                for (var l = a.length - 1; 0 <= l; l--) n.push(v(a[l]).val())
                ;(o =
                    '.techniques-button input[name$="' +
                    n.join('"], .techniques-button input[name$="') +
                    '"]'),
                    (s = ".tbox-" + n.join(", .tbox-")),
                    v(o).prop("checked", !1),
                    v(s).removeClass("active"),
                    v("#filter-techniques button.filters").prop("disabled", !1)
            } else v("#filter-techniques button.filters").prop("disabled", !0)
        }
        function u() {
            var r = s(),
                n = []
            r.removeSearch("tags"),
                v("#tags .btn-primary").each(function (t, e) {
                    n.push(v(e).data("tag")), r.setSearch("tags", n.join(","))
                }),
                v("#filters .sbbox").each(function (t, e) {
                    var n = []
                    v(e)
                        .find("input:not(:checked)")
                        .each(function (t, e) {
                            n.push(v(e).val())
                        }),
                        r.removeSearch(e.id.replace(/filter-/gi, "")),
                        0 < n.length &&
                            r.setSearch(
                                e.id.replace(/filter-/gi, ""),
                                n.join(",") + ""
                            )
                }),
                a(r)
        }
        function p(t) {
            var e = s(),
                n = 60
            0 < v(".navrow").outerHeight() &&
                (n = v(".navrow").outerHeight() + 5),
                setTimeout(function () {
                    window.scrollTo(0, t.offset().top - n)
                }, 100),
                e.fragment("#" + v(t).attr("id")),
                a(e),
                t.attr("tabindex", "-1").focus()
        }
        v("#filter-technologies").on(
            "change",
            "input[type=checkbox]",
            function (t) {
                b(), l(), o()
            }
        ),
            v("#filter-levels").on(
                "change",
                "input[type=checkbox]",
                function (t) {
                    b(), l(), i()
                }
            ),
            v("#hiddensc, .filter-status-row").on(
                "click",
                ".clearall",
                function (t) {
                    v(
                        "#filters input:not(:checked), #audiences input:not(:checked)"
                    ).each(function () {
                        v(this).prop("checked", "checked")
                    }),
                        v("#tags .btn-primary")
                            .removeClass("btn-primary")
                            .addClass("btn-default")
                            .attr("aria-pressed", "false"),
                        v("#tags .btn").removeAttr("disabled"),
                        v(".sc-wrapper.current").removeClass("current"),
                        o(),
                        l(),
                        i(),
                        h(),
                        p(v("#top"))
                }
            ),
            v(".sbbox-heading button.filters").on("click", function (t) {
                v(t.target)
                    .parent()
                    .parent()
                    .find("input:not(:checked)")
                    .each(function () {
                        v(this).prop("checked", "checked")
                    }),
                    o(),
                    l(),
                    i()
            }),
            v(".btn-only").on("click", function () {
                v(this)
                    .parents(".sbbox-body")
                    .find("input[type=checkbox]")
                    .prop("checked", !1),
                    v(this)
                        .parent()
                        .find("input[type=checkbox]")
                        .prop("checked", !0)
                        .trigger("change")
            }),
            (t = v(".sc-content hr:first-of-type")).hide(),
            t
                .prev()
                .append(
                    ' <button type="button" data-expanded="false" class="btn btn-info btn-xs"><span class="word-show"><svg aria-hidden="true" class="i-chevron-right"><use xlink:href="assets/figures/icons.svg#i-chevron-right"></use></svg> Show</span><span class="word-hide"><svg aria-hidden="true" class="i-chevron-down"><use xlink:href="assets/figures/icons.svg#i-chevron-down"></use></svg> Hide</span> full description</button>'
                ),
            t.find("~ *").hide(),
            t
                .prev()
                .find("button")
                .on("click", function (t) {
                    t.preventDefault(),
                        v(this)
                            .attr("data-expanded", function (t, e) {
                                return "true" == e ? "false" : "true"
                            })
                            .parent()
                            .find("~ *:not(hr)")
                            .toggle()
                })
        var h = function () {
            b()
            var n = [],
                t = "all success criteria",
                e = "",
                r = "",
                i = "all",
                o = "techniques",
                s = v("#wcagver").val()
            version =
                "2.1only" == s
                    ? "Only what’s added in WCAG 2.1:"
                    : "2.2only" == s
                    ? "Only what’s added in WCAG 2.2:"
                    : "WCAG " + s + ":"
            var a,
                l = v("#filter-techniques-content input"),
                c = l.filter(":checked")
            c.length < l.length &&
                ((a = []),
                c.each(function (t, e) {
                    "failures" == v(e).val()
                        ? a.push("failure")
                        : a.push(v(e).val())
                }),
                (i = y(a, "and"))),
                (i += " ")
            var u = v("#tags .btn-primary")
            0 < u.length &&
                (u.each(function (t, e) {
                    n.push(v(e).attr("data-tag"))
                }),
                (e = " <strong>tagged with " + y(n, "or") + "</strong>"),
                v("#tags .btn-default"))
            var p = [],
                h = v("#filter-levels input:checked"),
                d =
                    (v("#filter-levels input:not(:checked)"),
                    v("#filter-levels input"))
            h.length < d.length &&
                (h.each(function (t, e) {
                    p.push(v(e).attr("value").toUpperCase())
                }),
                (r = " for <strong>levels " + y(p, "and") + "</strong>")),
                (0 < u.length || h.length < d.length) &&
                    (t = "success criteria " + e + r)
            var f = [],
                g = v("#filter-technologies input:checked"),
                m =
                    (v("#filter-technologies input:not(:checked)"),
                    v("#filter-technologies input"))
            g.length < m.length &&
                (g.each(function (t, e) {
                    f.push(v(e).parent().text())
                }),
                (o =
                    " techniques for the technologies: <strong>" +
                    y(f, "and") +
                    "</strong>")),
                v("#status .ver").html(version),
                v("#status .sc").html(t),
                v("#status .tech").html(i + o + "."),
                "all techniques" == o && "all success criteria" == t
                    ? (v(".clearall").hide(),
                      v(".filter-status-row").removeClass("active"))
                    : (v(".clearall").show(),
                      v(".filter-status-row").addClass("active"))
        }
        v("#tags").on("click", ".btn", function (t) {
            b()
            var e = v(t.target)
            e.hasClass("btn-primary")
                ? e
                      .removeClass("btn-primary")
                      .addClass("btn-default")
                      .attr("aria-pressed", "false")
                : e
                      .removeClass("btn-default")
                      .addClass("btn-primary")
                      .attr("aria-pressed", "true"),
                i(),
                u()
        }),
            v("#showalltags").on("click", function (t) {
                var e = v("#tags").is(".open")
                    ? "Show all tags"
                    : "Show fewer tags"
                v(this).text(e), v("#tags").toggleClass("open")
            }),
            v("#audiences").on("change", "input", function (t) {
                v("#tags button").prop("disabled", !1),
                    v("#tags button").removeClass("first")
                var n = []
                v("#audiences input:checked").each(function (t, e) {
                    n.push(v(e).val())
                })
                var e = "[data-count" + n.join('="0"][data-count') + '="0"]'
                v("#tags button" + e).prop("disabled", !0),
                    v("#tags button" + e)
                        .first()
                        .addClass("first"),
                    c(),
                    o(),
                    i()
            }),
            v("#filter-techniques-content").on("change", "input", function (t) {
                c(), o(), i()
            }),
            v("main").on(
                "click",
                ".techniques-button .btn-techniques",
                function (t) {
                    var e = v(t.target),
                        n = e.attr("aria-controls"),
                        r = s(),
                        i = []
                    if (
                        (v('.btn-techniques[data-expanded="true"]').each(
                            function (t, e) {
                                i.push(v(e).attr("aria-controls"))
                            }
                        ),
                        "false" == e.attr("data-expanded"))
                    )
                        i.push(n)
                    else
                        for (var o = i.length - 1; 0 <= o; o--)
                            i[o] == n && i.splice(o, 1)
                    0 < i.length
                        ? r.setSearch(
                              "showtechniques",
                              i.join(",").replace(/techniques-/gi, "") + ""
                          )
                        : r.removeSearch("showtechniques"),
                        d(0 < i.length),
                        a(r)
                }
            ),
            v("#sharethisviewbutton").on("click", function () {
                var t = window.history.location || window.location,
                    e = v(this).parent().find(".sharebox")
                e.hasClass("open")
                    ? e.removeClass("open")
                    : (e.addClass("open"),
                      e.find("input").val(t).select().focus())
            }),
            v("#sharethisviewbutton")
                .parent()
                .find(".sharebox button")
                .on("click", function () {
                    v(this).parent().parent().parent().removeClass("open"),
                        v("#sharethisviewbutton").focus()
                })
        var e = v("#expandcollapsalltechniques")
        function d(t) {
            e.attr("data-expanded", t),
                e
                    .find("span")
                    .html(
                        (t ? "Collapse" : "Expand") +
                            " <strong>all</strong> sections"
                    )
        }
        e.on("click", function () {
            var t = "true" != v(this).attr("data-expanded")
            v(".sc-text button")
                .attr("data-expanded", t)
                .parent()
                .find("~ *:not(hr)")
                .toggle()
            var e = s()
            t
                ? e.setSearch(
                      "showtechniques",
                      v(".btn-techniques[data-expanded]")
                          .toArray()
                          .map(function (t) {
                              return t
                                  .getAttribute("aria-controls")
                                  .replace(/^techniques-/, "")
                          })
                          .join(",")
                  )
                : e.removeSearch("showtechniques"),
                a(e),
                (n = !0),
                r(),
                (n = !1)
        }),
            v(window).on("popstate", function (t) {
                ;(n = !0), r(), (n = !1)
            }),
            v("html").addClass("has-js"),
            896 < v(window).width()
                ? v("html").addClass("large")
                : v("html").removeClass("large"),
            v(window).width() < 480 &&
                v("#hidesidebars").not(":visible").trigger("click"),
            v(".mainrow aside > div").css("top", v(".navrow").height()),
            v("#hidesidebars").on("click", function () {
                var t = s()
                t.addSearch("hidesidebar", !0),
                    v(".sidebar").hide(),
                    v(".mainrow").addClass("sidebar-hidden"),
                    v("#showsidebars").show().focus(),
                    a(t)
            }),
            v("#showsidebars").on("click", function () {
                var t = s()
                t.removeSearch("hidesidebar"),
                    v(".sidebar").show(),
                    v(".mainrow").removeClass("sidebar-hidden"),
                    v("#showsidebars").hide(),
                    v("#hidesidebars").focus(),
                    a(t)
            }),
            v("#navtabs a").on("click", function (t) {
                var e = s()
                e.setSearch("currentsidebar", v(this).attr("href")), a(e)
            }),
            v("#overview").on("click", "a", function (t) {
                t.preventDefault()
                var e = v(t.target),
                    n = e.is("a") ? e.attr("href") : e.parents("a").attr("href")
                return p(v(n)), !1
            }),
            v("#hiddennav").on("click", function (t) {
                t.preventDefault(), p(v("#hiddensc"))
            }),
            v(".maininner").on(
                "webkitAnimationEnd oanimationend msAnimationEnd animationend",
                function (t) {
                    v(this).removeClass("loading"),
                        v(".filter-status .loaded").show(),
                        v(".filter-status .loading").hide()
                }
            ),
            v("#deselecttags").on("click", function (t) {
                t.preventDefault(),
                    v("#tags .btn-primary")
                        .removeClass("btn-primary")
                        .addClass("btn-default")
                        .attr("aria-pressed", "false"),
                    o(),
                    i(),
                    h(),
                    v(this).prop("disabled", !0)
            }),
            v("#wcagver").on("change", function (t) {
                t.preventDefault()
                var e = s()
                e.setSearch("versions", v("#wcagver").val()),
                    o(),
                    l(),
                    i(),
                    h(),
                    a(e)
            }),
            svg4everybody(),
            (n = !0),
            r(),
            (n = !1)
    })
