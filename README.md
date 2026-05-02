
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Keep On Baking">
  <title>Keep On Baking</title>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg:#FDF5F7; --sur:#FFFFFF; --pri:#8B2252; --acc:#C85480;
      --acc-lt:#F5D0DC; --bor:#F0D8E2; --txt:#3D1A26; --mut:#A07080;
      --ok:#6B9E70; --warn:#C4923A; --err:#C04040;
      --nh:64px; --hh:56px;
    }
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    html,body{font-family:'Lato',sans-serif;background:var(--bg);color:var(--txt);height:100%;overflow:hidden;}
    button,input,select,textarea{font-family:'Lato',sans-serif;}
    input:focus,textarea:focus{border-color:var(--acc)!important;outline:none;}
    #app{display:flex;flex-direction:column;height:100vh;height:-webkit-fill-available;}

    /* HEADER */
    .hdr{background:var(--pri);padding:0 16px;height:var(--hh);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;z-index:10;}
    .hdr-title{font-family:'Playfair Display',serif;font-size:21px;color:#fff;font-weight:700;letter-spacing:.3px;}
    .hdr-right{display:flex;align-items:center;gap:10px;}
    .sync-badge{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,.75);}
    .sync-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.4);}
    .sync-dot.ok{background:#90EE90;}
    .sync-dot.err{background:#FFB0B0;}
    .sync-dot.pend{background:#FFD700;animation:pls 1s infinite;}
    @keyframes pls{0%,100%{opacity:1}50%{opacity:.4}}
    .starter-btn{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.4);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;}

    /* CONTENT */
    .content{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-bottom:calc(var(--nh)+8px);}
    .view{display:none;}
    .view.active{display:block;}

    /* NAV */
    .bnav{position:fixed;bottom:0;left:0;right:0;height:var(--nh);background:var(--sur);border-top:1.5px solid var(--bor);display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom);}
    .nbtn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;background:none;color:var(--mut);font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;}
    .nbtn svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
    .nbtn.active{color:var(--acc);}

    /* FAB */
    .fab{position:fixed;bottom:calc(var(--nh)+14px+env(safe-area-inset-bottom));right:16px;width:52px;height:52px;border-radius:50%;background:var(--acc);color:#fff;border:none;font-size:28px;display:none;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(200,84,128,.4);cursor:pointer;z-index:50;}
    .fab:active{transform:scale(.93);}

    /* STARTER OVERLAY */
    .s-ov{position:fixed;inset:0;z-index:300;background:var(--bg);transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);overflow-y:auto;-webkit-overflow-scrolling:touch;padding-bottom:env(safe-area-inset-bottom);}
    .s-ov.open{transform:translateX(0);}
    .s-ohdr{background:var(--pri);color:#fff;padding:16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:1;}
    .s-ohdr .title{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;}
    .back-btn{border:none;background:rgba(255,255,255,.2);color:#fff;padding:8px 14px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;}

    /* MODAL */
    .m-ov{position:fixed;inset:0;background:rgba(61,26,38,.5);z-index:200;display:flex;align-items:flex-end;opacity:0;pointer-events:none;transition:opacity .25s;}
    .m-ov.open{opacity:1;pointer-events:all;}
    .modal{background:var(--bg);border-radius:24px 24px 0 0;width:100%;max-height:92vh;overflow-y:auto;-webkit-overflow-scrolling:touch;transform:translateY(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);padding-bottom:calc(16px+env(safe-area-inset-bottom));}
    .m-ov.open .modal{transform:translateY(0);}
    .m-handle{width:36px;height:4px;background:var(--bor);border-radius:2px;margin:12px auto 0;}
    .m-hdr{padding:14px 16px 8px;display:flex;align-items:center;justify-content:space-between;}
    .m-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:var(--pri);}
    .m-close{width:32px;height:32px;border-radius:50%;background:var(--acc-lt);border:none;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--acc);}
    .m-body{padding:6px 16px 8px;}

    /* BUTTONS */
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 18px;border-radius:10px;border:none;font-weight:700;font-size:14px;cursor:pointer;transition:all .15s;white-space:nowrap;}
    .btn:active{transform:scale(.96);}
    .btn-p{background:var(--acc);color:#fff;}
    .btn-pri{background:var(--pri);color:#fff;}
    .btn-s{background:var(--acc-lt);color:var(--pri);}
    .btn-g{background:transparent;color:var(--acc);border:1.5px solid var(--acc);}
    .btn-d{background:var(--err);color:#fff;}
    .btn-ok{background:var(--ok);color:#fff;}
    .btn-sm{padding:7px 13px;font-size:13px;border-radius:8px;}
    .btn-full{width:100%;}

    /* FORMS */
    .fg{margin-bottom:16px;}
    .fl{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--mut);margin-bottom:7px;}
    .fi,.fta{width:100%;padding:12px 14px;border:1.5px solid var(--bor);border-radius:10px;font-size:16px;color:var(--txt);background:var(--sur);transition:border-color .2s;}
    .fta{min-height:80px;resize:vertical;}

    /* PHOTO ZONE */
    .pzone{width:100%;height:140px;border:2px dashed var(--bor);border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:var(--sur);position:relative;overflow:hidden;cursor:pointer;}
    .pzone img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
    .pzone-hint{font-size:13px;color:var(--mut);text-align:center;line-height:1.5;pointer-events:none;}
    .pzone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;font-size:0;}
    .upwrap{height:4px;background:var(--bor);border-radius:2px;overflow:hidden;margin-top:8px;display:none;}
    .upbar{height:100%;background:var(--acc);transition:width .3s;width:0;}

    /* CATEGORY BUTTONS */
    .cat-grid{display:flex;flex-wrap:wrap;gap:8px;}
    .catb{padding:9px 14px;border-radius:20px;border:2px solid var(--bor);background:var(--sur);font-size:13px;font-weight:700;color:var(--mut);cursor:pointer;white-space:nowrap;transition:all .2s;}
    .catb.sel{border-color:var(--acc);background:var(--acc);color:#fff;}

    /* PILLS */
    .pill{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
    .c-breakfast{background:#FFF3CD;color:#856404;}
    .c-lunch{background:#D1ECF1;color:#0C5460;}
    .c-dinner{background:#D4EDDA;color:#155724;}
    .c-dessert{background:#F8D7DA;color:#721C24;}
    .c-snack{background:#FDE2D5;color:#7A3520;}
    .c-sourdough{background:#E8E0CC;color:#5A4A1A;}
    .c-baked{background:#F5D0DC;color:#8B2252;}

    /* ING ROWS */
    .ir{display:flex;gap:6px;margin-bottom:8px;align-items:center;}
    .ir input{padding:10px 10px;border:1.5px solid var(--bor);border-radius:8px;font-size:14px;background:var(--sur);color:var(--txt);}
    .ir .iq{width:82px;flex-shrink:0;}
    .ir .in{flex:1;}
    .del-ir{width:32px;height:32px;border-radius:50%;background:none;border:none;font-size:20px;color:var(--mut);cursor:pointer;flex-shrink:0;}

    /* SERVINGS */
    .sv-ctr{display:flex;align-items:center;gap:10px;}
    .sv-btn{width:36px;height:36px;border-radius:50%;border:2px solid var(--bor);background:var(--sur);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--pri);font-weight:700;}
    .sv-num{font-size:20px;font-weight:700;color:var(--pri);min-width:28px;text-align:center;}

    /* SECTION HEADERS */
    .shdr{padding:16px 16px 8px;display:flex;align-items:center;justify-content:space-between;}
    .stitle{font-family:'Playfair Display',serif;font-size:19px;font-weight:600;color:var(--pri);}
    .sub-h{font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:var(--pri);margin:14px 0 10px;}

    /* DASHBOARD */
    .d-greet{padding:18px 16px 6px;}
    .d-greet h2{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--pri);}
    .d-greet p{font-size:13px;color:var(--mut);margin-top:3px;}

    .tonight-card{margin:10px 16px 0;background:linear-gradient(135deg,var(--pri),var(--acc));border-radius:18px;padding:18px;color:#fff;box-shadow:0 4px 16px rgba(140,34,82,.25);}
    .t-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;opacity:.8;margin-bottom:8px;}
    .t-recipe{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;}
    .t-empty{font-size:15px;opacity:.75;font-style:italic;}
    .t-acts{display:flex;gap:8px;margin-top:12px;}
    .t-btn{padding:8px 14px;border-radius:8px;border:none;font-weight:700;font-size:13px;cursor:pointer;}
    .t-btn-w{background:#fff;color:var(--pri);}
    .t-btn-o{background:rgba(255,255,255,.2);color:#fff;border:1.5px solid rgba(255,255,255,.5);}

    .wk-card{margin:10px 16px 0;background:var(--sur);border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(140,34,82,.08);}
    .wk-row{display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid var(--bg);min-height:46px;gap:10px;}
    .wk-row:last-child{border-bottom:none;}
    .wk-day{font-size:12px;font-weight:700;color:var(--mut);width:32px;flex-shrink:0;}
    .wk-day.tod{color:var(--acc);}
    .wk-add{width:28px;height:28px;border-radius:50%;border:1.5px solid var(--bor);background:none;font-size:16px;color:var(--mut);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

    /* RECIPES */
    .rtabs{display:flex;background:var(--sur);border-bottom:1.5px solid var(--bor);}
    .rtab{flex:1;padding:12px;text-align:center;font-size:13px;font-weight:700;color:var(--mut);border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;}
    .rtab.active{color:var(--acc);border-bottom-color:var(--acc);}

    .fbar{display:flex;gap:8px;padding:10px 16px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;}
    .fbar::-webkit-scrollbar{display:none;}
    .fchip{flex-shrink:0;padding:7px 13px;border-radius:20px;border:1.5px solid var(--bor);background:var(--sur);font-size:13px;font-weight:700;color:var(--mut);cursor:pointer;white-space:nowrap;}
    .fchip.active{background:var(--pri);border-color:var(--pri);color:#fff;}

    .rgrid{padding:0 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .rcard{background:var(--sur);border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(140,34,82,.1);cursor:pointer;position:relative;}
    .rcard:active{transform:scale(.97);}
    .rcard-img{width:100%;height:110px;object-fit:cover;display:block;}
    .rcard-ph{width:100%;height:110px;background:linear-gradient(135deg,#FAE8EF,#F5D0DC);display:flex;align-items:center;justify-content:center;font-size:36px;}
    .rcard-body{padding:10px;}
    .rcard-name{font-size:14px;font-weight:700;color:var(--txt);margin-bottom:5px;line-height:1.3;}
    .heart-btn{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.9);border:none;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.15);}
    .rot-badge{font-size:10px;color:var(--acc);font-weight:700;margin-top:4px;}
    .r-det-img{width:calc(100%+32px);margin:0 -16px;max-height:220px;object-fit:cover;display:block;margin-bottom:14px;}

    /* IDEAS */
    .idea-grid{padding:0 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .idea-card{background:var(--sur);border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(140,34,82,.08);cursor:pointer;}
    .idea-card:active{transform:scale(.97);}
    .idea-card-img{width:100%;height:90px;object-fit:cover;display:block;}
    .idea-card-ph{width:100%;height:90px;background:linear-gradient(135deg,#FAE8EF,#F5D0DC);display:flex;align-items:center;justify-content:center;font-size:30px;}
    .idea-card-body{padding:10px;}
    .idea-card-name{font-size:14px;font-weight:700;color:var(--txt);line-height:1.3;}

    /* CALENDAR */
    .wknav{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--sur);border-bottom:1.5px solid var(--bor);}
    .wklbl{font-family:'Playfair Display',serif;font-size:17px;font-weight:600;color:var(--pri);}
    .wkbtn{width:36px;height:36px;border-radius:50%;border:none;background:var(--acc-lt);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--acc);}
    .dcard{margin:8px 16px 0;background:var(--sur);border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(140,34,82,.07);}
    .dhdr{padding:10px 14px;background:linear-gradient(90deg,#FAE8EF,#FDF5F7);display:flex;align-items:center;justify-content:space-between;}
    .dname{font-weight:700;font-size:14px;color:var(--pri);}
    .dname.tod{color:var(--acc);}
    .ddate{font-size:12px;color:var(--mut);}
    .sd-badge{font-size:11px;font-weight:700;background:#FFF3E8;color:#8B4513;padding:3px 8px;border-radius:6px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .mslot{padding:9px 14px;display:flex;align-items:center;border-bottom:1px solid var(--bg);min-height:46px;gap:8px;}
    .mslot:last-of-type{border-bottom:none;}
    .mslot-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--mut);width:72px;flex-shrink:0;}
    .mslot-val{flex:1;font-size:14px;font-weight:700;color:var(--txt);cursor:pointer;}
    .mslot-val:active{color:var(--acc);}
    .mslot-emp{flex:1;font-size:13px;color:var(--bor);font-style:italic;}
    .s-add{width:30px;height:30px;border-radius:50%;border:1.5px dashed var(--bor);background:none;font-size:18px;color:var(--mut);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .s-rm{background:none;border:none;color:var(--mut);font-size:18px;cursor:pointer;padding:4px;flex-shrink:0;}
    .dnote-row{padding:8px 14px;}
    .dnote-in{width:100%;padding:7px 10px;border:1.5px solid var(--bor);border-radius:8px;font-size:13px;background:var(--bg);color:var(--txt);}

    /* SHOPPING */
    .shop-tabs{display:flex;background:var(--sur);border-bottom:1.5px solid var(--bor);overflow-x:auto;scrollbar-width:none;}
    .shop-tabs::-webkit-scrollbar{display:none;}
    .stab{flex-shrink:0;flex:1;padding:13px 10px;text-align:center;font-size:13px;font-weight:700;color:var(--mut);border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;}
    .stab.active{color:var(--acc);border-bottom-color:var(--acc);}

    .slist{padding:0 16px;}
    .sitem{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--bor);}
    .sitem:last-child{border-bottom:none;}
    .schk{width:26px;height:26px;border-radius:50%;border:2px solid var(--bor);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;color:#fff;transition:all .2s;}
    .schk.done{background:var(--ok);border-color:var(--ok);}
    .sname{flex:1;font-size:15px;font-weight:700;color:var(--txt);}
    .sname.done{text-decoration:line-through;color:var(--mut);font-weight:400;}
    .sqty{font-size:13px;color:var(--mut);flex-shrink:0;}
    .ssrc{font-size:11px;color:var(--mut);margin-top:2px;}
    .sdel{background:none;border:none;color:var(--bor);font-size:18px;cursor:pointer;padding:4px;flex-shrink:0;}

    /* TRIP LIST */
    .trip-card{background:var(--sur);border-radius:14px;padding:14px 16px;margin:0 16px 10px;box-shadow:0 2px 8px rgba(140,34,82,.08);display:flex;align-items:center;justify-content:space-between;cursor:pointer;}
    .trip-card:active{transform:scale(.98);}
    .trip-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:600;color:var(--pri);}
    .trip-meta{font-size:12px;color:var(--mut);margin-top:3px;}

    /* STARTER */
    .sc-card{margin:16px;background:var(--sur);border-radius:18px;overflow:hidden;box-shadow:0 2px 12px rgba(140,34,82,.12);}
    .sc-top{background:linear-gradient(135deg,var(--pri),var(--acc));color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;}
    .sc-badge{font-size:14px;font-weight:700;}
    .sc-meta{display:flex;gap:10px;padding:12px 14px 0;}
    .sc-box{flex:1;background:var(--bg);border-radius:10px;padding:10px 12px;text-align:center;}
    .sc-box .v{font-size:14px;font-weight:700;color:var(--pri);}
    .sc-box .l{font-size:10px;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;margin-top:2px;}
    .ltog{display:flex;background:var(--bg);border-radius:8px;padding:3px;margin:12px 14px 0;}
    .lbtn{flex:1;padding:9px;border:none;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;background:transparent;color:var(--mut);transition:all .2s;}
    .lbtn.active{background:var(--sur);color:var(--pri);box-shadow:0 1px 4px rgba(140,34,82,.15);}
    .sc-acts{padding:12px 14px 14px;display:flex;gap:8px;}
    .bsched{background:var(--bg);border-radius:10px;padding:10px 12px;margin-top:10px;}
    .bsrow{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid var(--bor);font-size:13px;}
    .bsrow:last-child{border-bottom:none;}
    .bsdate{color:var(--mut);width:90px;flex-shrink:0;font-size:12px;}
    .blog-entry{padding:10px 14px;border-bottom:1px solid var(--bor);}
    .blog-date{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;}

    /* MISC */
    .empty{padding:40px 16px;text-align:center;color:var(--mut);}
    .empty .ei{font-size:48px;margin-bottom:12px;}
    input[type=date]{padding:11px 13px;border:1.5px solid var(--bor);border-radius:10px;font-size:15px;background:var(--sur);color:var(--txt);width:100%;}
    .picker-item{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--bor);cursor:pointer;}
    .picker-item:last-child{border-bottom:none;}
    .picker-th{width:46px;height:46px;border-radius:10px;object-fit:cover;flex-shrink:0;}
    .picker-ph{width:46px;height:46px;border-radius:10px;background:linear-gradient(135deg,#FAE8EF,#F5D0DC);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}

    /* DAY PICKER (add to calendar) */
    .day-pick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;}
    .day-pick-btn{padding:10px 4px;border-radius:10px;border:1.5px solid var(--bor);background:var(--sur);font-size:12px;font-weight:700;color:var(--txt);cursor:pointer;text-align:center;transition:all .2s;}
    .day-pick-btn.today-d{border-color:var(--acc);color:var(--acc);}
    .day-pick-btn.sel{background:var(--acc);border-color:var(--acc);color:#fff;}
    .slot-pick-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
    .slot-pick-btn{padding:12px;border-radius:10px;border:1.5px solid var(--bor);background:var(--sur);font-size:13px;font-weight:700;color:var(--txt);cursor:pointer;text-align:center;}
    .slot-pick-btn:active{background:var(--acc-lt);}

    .shop-card{margin:10px 16px 0;background:linear-gradient(135deg,#FAE8EF,#FDF5F7);border-radius:18px;padding:16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 3px 12px rgba(140,34,82,.12);border:1.5px solid var(--bor);}
    .shop-card:active{transform:scale(.98);}
    .shop-card-left{display:flex;align-items:center;gap:14px;}
    .shop-card-icon{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--pri),var(--acc));display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;}
    .shop-card-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:600;color:var(--pri);}
    .shop-card-sub{font-size:13px;color:var(--mut);margin-top:2px;}
    .quote-card{margin:10px 16px 0;background:var(--sur);border-radius:16px;padding:14px 16px;border-left:4px solid var(--acc);box-shadow:0 2px 8px rgba(140,34,82,.07);}
    .quote-text{font-family:'Playfair Display',serif;font-size:14px;font-style:italic;color:var(--pri);line-height:1.6;}
    .quote-ref{font-size:12px;color:var(--mut);margin-top:6px;font-weight:700;}
    .shop-opt-btn{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;border:1.5px solid var(--bor);background:var(--sur);width:100%;cursor:pointer;text-align:left;transition:all .2s;margin-bottom:10px;}
    .shop-opt-btn:active{background:var(--acc-lt);border-color:var(--acc);}
    .shop-opt-icon{font-size:30px;flex-shrink:0;}
    .shop-opt-title{font-weight:700;font-size:16px;color:var(--txt);}
    .shop-opt-sub{font-size:13px;color:var(--mut);margin-top:2px;}
  </style>
</head>
<body>
<div id="app">
  <div class="hdr">
    <span class="hdr-title">🍞 Keep On Baking</span>
    <div class="hdr-right">
      <span class="sync-badge"><span class="sync-dot pend" id="sdot"></span><span id="stxt">Connecting</span></span>
      <button class="starter-btn" onclick="openStarter()">🌱</button>
    </div>
  </div>
  <div class="content">
    <div class="view active" id="view-dashboard"><div id="d-body"></div></div>
    <div class="view" id="view-recipes"><div id="r-body"></div></div>
    <div class="view" id="view-calendar"><div id="c-body"></div></div>
    <div class="view" id="view-shopping"><div id="s-body"></div></div>
  </div>
  <nav class="bnav">
    <button class="nbtn active" data-v="dashboard" onclick="nav('dashboard')">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Home
    </button>
    <button class="nbtn" data-v="recipes" onclick="nav('recipes')">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>Recipes
    </button>
    <button class="nbtn" data-v="calendar" onclick="nav('calendar')">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Calendar
    </button>
    <button class="nbtn" data-v="shopping" onclick="nav('shopping')">
      <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Shopping
    </button>
  </nav>
  <button class="fab" id="fab" onclick="fabAct()">+</button>
</div>

<!-- Starter Overlay -->
<div class="s-ov" id="s-ov">
  <div class="s-ohdr">
    <span class="title">🌱 Starter Manager</span>
    <button class="back-btn" onclick="closeStarter()">✕ Close</button>
  </div>
  <div id="s-inner"></div>
</div>

<!-- Modal -->
<div class="m-ov" id="m-ov" onclick="handleOvClick(event)">
  <div class="modal" id="modal">
    <div class="m-handle"></div>
    <div class="m-hdr">
      <span class="m-title" id="m-title"></span>
      <button class="m-close" onclick="closeModal()">×</button>
    </div>
    <div class="m-body" id="m-body"></div>
  </div>
</div>

<script>
'use strict';
// ============================================================
// FIREBASE
// ============================================================
firebase.initializeApp({
  apiKey:"AIzaSyAECKBZbUYyvuTnsYJLJikEb5ZmgbaP4yc",
  authDomain:"keep-on-baking.firebaseapp.com",
  databaseURL:"https://keep-on-baking-default-rtdb.firebaseio.com",
  projectId:"keep-on-baking",
  storageBucket:"keep-on-baking.firebasestorage.app",
  messagingSenderId:"723183814903",
  appId:"1:723183814903:web:566962f611f3f269172bf2"
});
const db=firebase.database(), storage=firebase.storage();

// ============================================================
// CONSTANTS
// ============================================================
const CATS=[
  {id:'breakfast',label:'Breakfast',emoji:'🌅',cls:'c-breakfast'},
  {id:'lunch',label:'Lunch',emoji:'☀️',cls:'c-lunch'},
  {id:'dinner',label:'Dinner',emoji:'🍽️',cls:'c-dinner'},
  {id:'dessert',label:'Dessert',emoji:'🍰',cls:'c-dessert'},
  {id:'snack',label:'Snack',emoji:'🫐',cls:'c-snack'},
  {id:'sourdough',label:'Bread/Sourdough',emoji:'🍞',cls:'c-sourdough'},
  {id:'baked',label:'Baked Goods',emoji:'🥐',cls:'c-baked'},
];
const CM={};CATS.forEach(c=>CM[c.id]=c);

const SLOTS=[
  {id:'breakfast',label:'Breakfast',cats:['breakfast','snack']},
  {id:'lunch',label:'Lunch',cats:['lunch','snack']},
  {id:'dinner',label:'Dinner',cats:['dinner']},
  {id:'dessert',label:'Dessert',cats:['dessert','baked']},
];

const SD=[
  {offset:-3,emoji:'🌾',label:'Feed Starter / Levain Build'},
  {offset:-2,emoji:'🥣',label:'Mix Dough + Bulk Ferment'},
  {offset:-1,emoji:'🔄',label:'Shape + Cold Proof (fridge)'},
  {offset:0, emoji:'🔥',label:'Score & Bake!'},
];

const STAPLE_DEF=[
  'All-purpose flour','Bread flour','Butter','Eggs','Sugar','Brown sugar',
  'Salt','Olive oil','Milk','Baking powder','Baking soda','Active dry yeast',
  'Honey','Vanilla extract'
].map(n=>({name:n,qty:'',checked:false}));

// ============================================================
// STATE
// ============================================================
let recipes={},calD={},ideas={},trips={};
let starterD={lastFed:null,location:'counter',tempNote:'',bakeDay:null};
let bakeLog={},shopItems=[],shopStaples=[];
let curView='dashboard',wkOff=0,rFilt='all',rTab='recipes',shopTab='list';
let pendingPhoto=null,rFormCat=null,rFormServ=4,editingRid=null,addShopRid=null;
let calPickRid=null,calPickStep=1,calPickDs=null;
let activeTripId=null;

// ============================================================
// FIREBASE LISTENERS
// ============================================================
function initFB(){
  setSS('pend','Syncing...');
  db.ref('/recipes').on('value',s=>{
    recipes=s.val()||{};setSS('ok','Synced');
    if(curView==='recipes')renderRecipes();
    if(curView==='dashboard')renderDash();
    if(curView==='calendar')renderCalendar();
  },()=>setSS('err','Offline'));
  db.ref('/calendar').on('value',s=>{
    calD=s.val()||{};
    if(curView==='calendar')renderCalendar();
    if(curView==='dashboard')renderDash();
  });
  db.ref('/ideas').on('value',s=>{
    ideas=s.val()||{};
    if(curView==='recipes'&&rTab==='ideas')renderRecipes();
  });
  db.ref('/starter').on('value',s=>{
    starterD=Object.assign({lastFed:null,location:'counter',tempNote:'',bakeDay:null},s.val()||{});
    if(document.getElementById('s-ov').classList.contains('open'))renderStarter();
    if(curView==='dashboard')renderDash();
  });
  db.ref('/starter/log').on('value',s=>{
    bakeLog=s.val()||{};
    if(document.getElementById('s-ov').classList.contains('open'))renderStarter();
  });
  db.ref('/shopping/items').on('value',s=>{
    shopItems=s.val()||[];
    if(curView==='shopping'&&shopTab==='list')renderShopTab();
  });
  db.ref('/shopping/staples').on('value',s=>{
    shopStaples=s.val();
    if(!shopStaples||!shopStaples.length){db.ref('/shopping/staples').set(STAPLE_DEF);shopStaples=STAPLE_DEF;}
    if(curView==='shopping'&&shopTab==='staples')renderShopTab();
  });
  db.ref('/shopping/trips').on('value',s=>{
    trips=s.val()||{};
    if(curView==='shopping'&&shopTab==='trips')renderShopTab();
  });
}
function setSS(s,t){
  const d=document.getElementById('sdot'),tx=document.getElementById('stxt');
  if(d)d.className='sync-dot '+s;if(tx)tx.textContent=t;
}

// ============================================================
// NAVIGATION
// ============================================================
function nav(v){
  curView=v;
  document.querySelectorAll('.nbtn').forEach(b=>b.classList.toggle('active',b.dataset.v===v));
  document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id==='view-'+v));
  const fab=document.getElementById('fab');
  fab.style.display=(v==='recipes'||v==='shopping')?'flex':'none';
  render();
}
function render(){
  if(curView==='dashboard')renderDash();
  else if(curView==='recipes')renderRecipes();
  else if(curView==='calendar')renderCalendar();
  else if(curView==='shopping')renderShopping();
}
function fabAct(){
  if(curView==='recipes'){
    if(rTab==='recipes')openRecipeForm(null);
    else openIdeaForm(null);
  } else if(curView==='shopping'){
    if(shopTab==='trips')openNewTripModal();
    else openAddItemModal();
  }
}

// ============================================================
// DASHBOARD
// ============================================================
// ============================================================
// GREETINGS & QUOTES
// ============================================================
const GREETINGS=[
  {h:[0,11],  msgs:["Good morning, beautiful! 🌸","Rise and shine, love! ☀️","Good morning, gorgeous! 🌷","Hello sweetheart! 🥐 Ready to bake?","Morning, lovely! 💕"]},
  {h:[12,16], msgs:["Hello beautiful! ✨","Hey gorgeous! 💕","Hello lovely! 🌸","Hi sweetheart! 🫶","Hello, my love! 🌺"]},
  {h:[17,23], msgs:["Good evening, love! 🌙","Good evening, beautiful! ✨","Evening, gorgeous! 💕","Good evening, sweetheart! 🌸","Evening, lovely! 🌟"]},
];
const SUBTITLES=["What are we baking today?","The kitchen is yours today.","Ready to create something delicious?","Something smells amazing already!","Let's make something wonderful. 🍞","Your kitchen awaits!","Time to make magic happen!"];
const QUOTES=[
  {text:"Give us this day our daily bread.",ref:"Matthew 6:11"},
  {text:"Taste and see that the Lord is good.",ref:"Psalm 34:8"},
  {text:"The kingdom of heaven is like leaven a woman hid in flour until it was all leavened.",ref:"Matthew 13:33"},
  {text:"Whether you eat or drink, do it all for the glory of God.",ref:"1 Corinthians 10:31"},
  {text:"She brings her food from afar... her lamp does not go out at night.",ref:"Proverbs 31:15"},
  {text:"Man shall not live by bread alone, but by every word from the mouth of God.",ref:"Matthew 4:4"},
  {text:"Blessed shall be your basket and your kneading bowl.",ref:"Deuteronomy 28:5"},
  {text:"Strength and dignity are her clothing, and she laughs at the time to come.",ref:"Proverbs 31:25"},
  {text:"She works with willing hands.",ref:"Proverbs 31:13"},
  {text:"Her children rise up and call her blessed; her husband also praises her.",ref:"Proverbs 31:28"},
  {text:"Whatever you do, work heartily, as for the Lord and not for men.",ref:"Colossians 3:23"},
  {text:"I can do all things through Christ who strengthens me.",ref:"Philippians 4:13"},
  {text:"The Lord your God is in your midst. He will rejoice over you with gladness.",ref:"Zephaniah 3:17"},
  {text:"She opens her hand to the poor and reaches out her hands to the needy.",ref:"Proverbs 31:20"},
  {text:"You are altogether beautiful, my love; there is no flaw in you.",ref:"Song of Solomon 4:7"},
];

function getDayIdx(){
  const now=new Date();
  return Math.floor((now-new Date(now.getFullYear(),0,0))/(1000*60*60*24));
}

function getDashGreeting(){
  const h=new Date().getHours();
  const dayIdx=getDayIdx();
  const grp=GREETINGS.find(g=>h>=g.h[0]&&h<=g.h[1])||GREETINGS[0];
  return grp.msgs[dayIdx%grp.msgs.length];
}

function renderDash(){
  const el=document.getElementById('d-body');
  const today=fmtD(new Date());
  const ss=starterD.lastFed?getStStatus():null;
  const dayIdx=getDayIdx();
  const greeting=getDashGreeting();
  const subtitle=SUBTITLES[dayIdx%SUBTITLES.length];
  const quote=QUOTES[dayIdx%QUOTES.length];
  const activeItems=shopItems.filter(i=>!i.checked).length;
  const totalItems=shopItems.length;
  const shopSub=totalItems>0?`${activeItems} item${activeItems!==1?'s':''} remaining`:'Tap to create a list';

  const wkHtml=getWeekDates(0).map(ds=>{
    const d=new Date(ds+'T12:00:00'),isT=ds===today;
    const day=calD[ds]||{};
    const meals=SLOTS.filter(s=>day[s.id]).map(s=>{const r=recipes[day[s.id]];return r?r.name:null;}).filter(Boolean);
    const sde=day.sourdough;
    return `<div class="wk-row">
      <span class="wk-day ${isT?'tod':''}">${d.toLocaleDateString('en',{weekday:'short'})}</span>
      <div style="flex:1;min-width:0">
        ${sde?`<div style="font-size:12px;color:#8B4513;font-weight:700">${sde.emoji} ${sde.label}</div>`:''}
        ${meals.length?`<div style="font-size:14px;color:var(--txt)">${meals.join(' · ')}</div>`:(!sde?`<div style="font-size:13px;color:var(--bor);font-style:italic">—</div>`:'')}
      </div>
      <button class="wk-add" onclick="quickAddMeal('${ds}')" title="Add meal">+</button>
    </div>`;
  }).join('');

  el.innerHTML=`
    <div class="d-greet">
      <h2>${greeting}</h2>
      <p>${subtitle}</p>
    </div>

    <div class="quote-card">
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-ref">— ${quote.ref}</div>
    </div>

    <div class="shop-card" onclick="openShoppingCard()">
      <div class="shop-card-left">
        <div class="shop-card-icon">🛍️</div>
        <div>
          <div class="shop-card-title">Shopping List</div>
          <div class="shop-card-sub">${shopSub}</div>
        </div>
      </div>
      <span style="font-size:22px;color:var(--acc)">›</span>
    </div>

    ${ss?`<div style="margin:10px 16px 0;padding:12px 14px;background:var(--sur);border-radius:14px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 8px rgba(140,34,82,.08)">
      <span style="font-size:14px;font-weight:700;color:var(--pri)">🌱 Starter: ${ss.emoji} ${ss.label}</span>
      <button onclick="openStarter()" style="border:none;background:none;font-size:13px;font-weight:700;color:var(--acc);cursor:pointer">Manage →</button>
    </div>`:''}

    <div class="shdr">
      <span class="stitle">This Week</span>
      <button onclick="nav('calendar')" style="border:none;background:none;font-size:13px;font-weight:700;color:var(--acc);cursor:pointer">Full Calendar →</button>
    </div>
    <div class="wk-card">${wkHtml}</div>
    <div style="height:12px"></div>
  `;
}

function openShoppingCard(){
  const activeItems=shopItems.filter(i=>!i.checked).length;
  document.getElementById('m-title').textContent='🛍️ Shopping List';
  document.getElementById('m-body').innerHTML=`
    <p style="font-size:14px;color:var(--mut);margin-bottom:16px">What kind of list would you like to create?</p>
    <button class="shop-opt-btn" onclick="openNewListFromDash()">
      <span class="shop-opt-icon">📋</span>
      <div>
        <div class="shop-opt-title">New List</div>
        <div class="shop-opt-sub">Start a fresh, blank shopping list</div>
      </div>
    </button>
    <button class="shop-opt-btn" onclick="openWeeklyListFromDash()">
      <span class="shop-opt-icon">🗓️</span>
      <div>
        <div class="shop-opt-title">Weekly List</div>
        <div class="shop-opt-sub">Pre-filled from your meal plan this week</div>
      </div>
    </button>
    <button class="shop-opt-btn" onclick="openTripListFromDash()">
      <span class="shop-opt-icon">✈️</span>
      <div>
        <div class="shop-opt-title">Trip List</div>
        <div class="shop-opt-sub">For vacation, holidays, or special occasions</div>
      </div>
    </button>
    ${activeItems>0?`<div style="margin-top:4px;padding:12px 14px;background:var(--acc-lt);border-radius:12px;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:14px;color:var(--pri);font-weight:700">Current list: ${activeItems} item${activeItems!==1?'s':''} remaining</span>
      <button onclick="nav('shopping');closeModal()" style="border:none;background:none;font-size:13px;font-weight:700;color:var(--acc);cursor:pointer">View →</button>
    </div>`:''}
    <div style="height:8px"></div>
  `;
  showModal();
}

function openNewListFromDash(){
  if(shopItems.length>0){
    if(!confirm('Start a fresh list? Your current list ('+(shopItems.length)+' items) will be cleared.'))return;
  }
  db.ref('/shopping/items').set([]);
  closeModal();
  nav('shopping');
}

function openWeeklyListFromDash(){
  closeModal();
  genFromCal();
  nav('shopping');
}

function openTripListFromDash(){
  closeModal();
  setTimeout(()=>{
    shopTab='trips';
    nav('shopping');
    setTimeout(()=>openNewTripModal(),300);
  },250);
}

function quickAddMeal(ds){
  // Step 1: pick meal slot
  document.getElementById('m-title').textContent='Add to '+new Date(ds+'T12:00:00').toLocaleDateString('en',{weekday:'long',month:'short',day:'numeric'});
  document.getElementById('m-body').innerHTML=`
    <p style="font-size:13px;color:var(--mut);margin-bottom:14px">Which meal?</p>
    <div class="slot-pick-grid">
      ${SLOTS.map(s=>`<button class="slot-pick-btn" onclick="openSlotPicker('${ds}','${s.id}')">${s.label}</button>`).join('')}
    </div>
    <div style="height:8px"></div>
  `;
  showModal();
}

// ============================================================
// RECIPES
// ============================================================
function renderRecipes(){
  const el=document.getElementById('r-body');
  el.innerHTML=`
    <div class="rtabs">
      <button class="rtab ${rTab==='recipes'?'active':''}" onclick="setRTab('recipes')">📖 Recipes</button>
      <button class="rtab ${rTab==='ideas'?'active':''}" onclick="setRTab('ideas')">💡 Meal Ideas</button>
    </div>
    <div id="r-tab-body"></div>
  `;
  renderRTab();
}
function setRTab(t){rTab=t;renderRecipes();}

function renderRTab(){
  const el=document.getElementById('r-tab-body');if(!el)return;
  if(rTab==='recipes'){
    const all=Object.entries(recipes);
    const filtered=all.filter(([,r])=>{
      if(rFilt==='favorites')return r.favorite;
      return rFilt==='all'||r.category===rFilt;
    });
    el.innerHTML=`
      <div class="fbar">
        <button class="fchip ${rFilt==='all'?'active':''}" onclick="setFilt('all')">All (${all.length})</button>
        <button class="fchip ${rFilt==='favorites'?'active':''}" onclick="setFilt('favorites')">❤️ Favorites</button>
        ${CATS.map(c=>{const n=all.filter(([,r])=>r.category===c.id).length;return n>0?`<button class="fchip ${rFilt===c.id?'active':''}" onclick="setFilt('${c.id}')">${c.emoji} ${c.label}</button>`:''}).join('')}
      </div>
      ${filtered.length
        ?`<div class="shdr"><span class="stitle">My Recipes</span><span style="font-size:13px;color:var(--mut)">${filtered.length} recipe${filtered.length!==1?'s':''}</span></div>
          <div class="rgrid">${filtered.map(([id,r])=>rCardHtml(id,r)).join('')}</div>
          <div style="height:16px"></div>`
        :`<div class="empty"><div class="ei">${rFilt==='favorites'?'💗':rFilt==='all'?'📖':CM[rFilt]?.emoji||'📖'}</div><p>${rFilt==='favorites'?'No favorites yet.<br>Tap ♡ on any recipe!':'No recipes yet.<br>Tap + to add your first one!'}</p></div>`
      }
    `;
  } else {
    const ideaList=Object.entries(ideas);
    el.innerHTML=`
      <div class="shdr"><span class="stitle">Meal Ideas</span><span style="font-size:13px;color:var(--mut)">${ideaList.length} idea${ideaList.length!==1?'s':''}</span></div>
      ${ideaList.length
        ?`<div class="idea-grid">${ideaList.map(([id,idea])=>ideaCardHtml(id,idea)).join('')}</div><div style="height:16px"></div>`
        :`<div class="empty"><div class="ei">💡</div><p>No ideas yet.<br>Tap + to capture a meal idea<br>before you forget!</p></div>`
      }
    `;
  }
}

function setFilt(f){rFilt=f;renderRTab();}

function rCardHtml(id,r){
  const c=CM[r.category];
  return `<div class="rcard" onclick="openRecipeDetail('${id}')">
    <button class="heart-btn" onclick="toggleFav(event,'${id}')">${r.favorite?'❤️':'🤍'}</button>
    ${r.photoURL?`<img class="rcard-img" src="${r.photoURL}" loading="lazy">`:`<div class="rcard-ph">${c?c.emoji:'🍽️'}</div>`}
    <div class="rcard-body">
      <div class="rcard-name">${esc(r.name)}</div>
      ${c?`<span class="pill ${c.cls}">${c.emoji} ${c.label}</span>`:''}
      ${r.regularRotation?`<div class="rot-badge">⭐ Regular rotation</div>`:''}
    </div>
  </div>`;
}

function ideaCardHtml(id,idea){
  return `<div class="idea-card" onclick="openIdeaDetail('${id}')">
    ${idea.photoURL?`<img class="idea-card-img" src="${idea.photoURL}" loading="lazy">`:`<div class="idea-card-ph">💡</div>`}
    <div class="idea-card-body"><div class="idea-card-name">${esc(idea.name)}</div></div>
  </div>`;
}

function toggleFav(e,id){
  e.stopPropagation();
  db.ref('/recipes/'+id+'/favorite').set(!recipes[id]?.favorite);
}

// ============================================================
// RECIPE DETAIL
// ============================================================
function openRecipeDetail(id){
  const r=recipes[id];if(!r)return;
  const c=CM[r.category];
  const base=r.servings||4;
  document.getElementById('m-title').textContent=esc(r.name);
  document.getElementById('m-body').innerHTML=`
    ${r.photoURL?`<img class="r-det-img" src="${r.photoURL}">`:''}
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px">
      ${c?`<span class="pill ${c.cls}">${c.emoji} ${c.label}</span>`:'<span></span>'}
      <div style="display:flex;gap:8px">
        <button class="btn btn-s btn-sm" onclick="openRecipeForm('${id}')">✏️ Edit</button>
        <button class="btn btn-d btn-sm" onclick="confirmDel('${id}')">🗑️</button>
      </div>
    </div>
    ${r.ingredients&&r.ingredients.length?`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span class="sub-h" style="margin:0">Ingredients</span>
        <div class="sv-ctr">
          <button class="sv-btn" onclick="adjDetServ('${id}',-1)">−</button>
          <span class="sv-num" id="det-sv" data-base="${base}">${base}</span>
          <span style="font-size:13px;color:var(--mut)">servings</span>
          <button class="sv-btn" onclick="adjDetServ('${id}',1)">+</button>
        </div>
      </div>
      <ul style="list-style:none" id="det-ing">
        ${r.ingredients.map(i=>`<li style="padding:8px 0;border-bottom:1px solid var(--bor);display:flex;justify-content:space-between;font-size:15px"><span>${esc(i.name)}</span><span style="color:var(--mut)">${esc(i.qty||'')}</span></li>`).join('')}
      </ul>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn btn-ok" onclick="openAddToShop('${id}')" style="flex:1">🛒 Add to Shopping</button>
        <button class="btn btn-p" onclick="openAddToCal('${id}')" style="flex:1">🗓️ Add to Calendar</button>
      </div>
    `:`<button class="btn btn-p btn-full" style="margin-bottom:14px" onclick="openAddToCal('${id}')">🗓️ Add to Calendar</button>`}
    ${r.notes?`<span class="sub-h">Notes</span><p style="font-size:15px;line-height:1.6;white-space:pre-wrap;color:var(--txt)">${esc(r.notes)}</p>`:''}
    <div style="height:8px"></div>
  `;
  showModal();
}

function adjDetServ(id,delta){
  const el=document.getElementById('det-sv');if(!el)return;
  const base=parseInt(el.dataset.base)||4;
  const nxt=Math.max(1,(parseInt(el.textContent)||base)+delta);
  el.textContent=nxt;
  const r=recipes[id];if(!r||!r.ingredients)return;
  const factor=nxt/base;
  document.getElementById('det-ing').innerHTML=r.ingredients.map(i=>`
    <li style="padding:8px 0;border-bottom:1px solid var(--bor);display:flex;justify-content:space-between;font-size:15px">
      <span>${esc(i.name)}</span><span style="color:var(--mut)">${esc(scaleQ(i.qty,factor))}</span>
    </li>`).join('');
}

// Add to Calendar from Recipe Detail
function openAddToCal(id){
  calPickRid=id;calPickStep=1;calPickDs=null;
  const dates=getWeekDates(0);
  const today=fmtD(new Date());
  document.getElementById('m-title').textContent='🗓️ Add to Calendar';
  document.getElementById('m-body').innerHTML=`
    <p style="font-size:13px;color:var(--mut);margin-bottom:12px">Which day?</p>
    <div class="day-pick-grid">
      ${dates.map(ds=>{
        const d=new Date(ds+'T12:00:00');
        const isT=ds===today;
        return `<button class="day-pick-btn ${isT?'today-d':''}" onclick="calPickDay('${ds}')" data-ds="${ds}">
          <div>${d.toLocaleDateString('en',{weekday:'short'})}</div>
          <div style="font-size:11px;opacity:.7">${d.toLocaleDateString('en',{month:'short',day:'numeric'})}</div>
        </button>`;
      }).join('')}
      ${dates.length<8?`<button class="day-pick-btn" onclick="calPickDay('${fmtD(addDays(new Date(dates[6]+'T12:00:00'),1))}')"><div>Next</div><div style="font-size:11px;opacity:.7">week +</div></button>`:''}
    </div>
    <div style="height:8px"></div>
  `;
  showModal();
}

function calPickDay(ds){
  calPickDs=ds;
  document.querySelectorAll('.day-pick-btn').forEach(b=>b.classList.toggle('sel',b.dataset.ds===ds));
  const d=new Date(ds+'T12:00:00');
  document.getElementById('m-title').textContent='🗓️ '+d.toLocaleDateString('en',{weekday:'long',month:'short',day:'numeric'});
  document.getElementById('m-body').innerHTML=`
    <p style="font-size:13px;color:var(--mut);margin-bottom:12px">Which meal?</p>
    <div class="slot-pick-grid">
      ${SLOTS.map(s=>`<button class="slot-pick-btn" onclick="calPickSlot('${s.id}')">${s.label}</button>`).join('')}
    </div>
    <button class="btn btn-s btn-full" onclick="openAddToCal('${calPickRid}')" style="margin-top:10px">← Back</button>
    <div style="height:8px"></div>
  `;
}

function calPickSlot(slot){
  if(!calPickDs||!calPickRid)return;
  db.ref('/calendar/'+calPickDs+'/'+slot).set(calPickRid);
  closeModal();
}

// Add to Shopping
function openAddToShop(id){
  addShopRid=id;
  const r=recipes[id];if(!r)return;
  const base=r.servings||4;
  document.getElementById('m-title').textContent='🛒 Add to Shopping List';
  document.getElementById('m-body').innerHTML=`
    <p style="font-size:14px;color:var(--mut);margin-bottom:14px">Adjust servings then add all ingredients.</p>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <span style="font-weight:700;color:var(--txt)">Servings:</span>
      <div class="sv-ctr">
        <button class="sv-btn" onclick="adjAddServ(-1)">−</button>
        <span class="sv-num" id="add-sv" data-base="${base}">${base}</span>
        <button class="sv-btn" onclick="adjAddServ(1)">+</button>
      </div>
    </div>
    <div id="add-ing-prev">
      ${(r.ingredients||[]).map(i=>`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--bor);font-size:14px"><span>${esc(i.name)}</span><span style="color:var(--mut)">${esc(i.qty||'')}</span></div>`).join('')}
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-s" onclick="closeModal()" style="flex:1">Cancel</button>
      <button class="btn btn-p" onclick="doAddToShop()" style="flex:1">Add to List</button>
    </div>
  `;
  showModal();
}

function adjAddServ(delta){
  const el=document.getElementById('add-sv');if(!el)return;
  const base=parseInt(el.dataset.base)||4;
  const nxt=Math.max(1,(parseInt(el.textContent)||base)+delta);
  el.textContent=nxt;
  const r=recipes[addShopRid];if(!r||!r.ingredients)return;
  const factor=nxt/base;
  document.getElementById('add-ing-prev').innerHTML=r.ingredients.map(i=>`
    <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--bor);font-size:14px">
      <span>${esc(i.name)}</span><span style="color:var(--mut)">${esc(scaleQ(i.qty,factor))}</span>
    </div>`).join('');
}

function doAddToShop(){
  const r=recipes[addShopRid];if(!r)return;
  const el=document.getElementById('add-sv');
  const cur=el?parseInt(el.textContent)||r.servings||4:r.servings||4;
  const factor=cur/(r.servings||4);
  db.ref('/shopping/items').set([...shopItems,...(r.ingredients||[]).filter(i=>i.name).map(i=>({name:i.name,qty:scaleQ(i.qty,factor),checked:false,source:r.name}))]);
  closeModal();nav('shopping');
}

// ============================================================
// RECIPE FORM
// ============================================================
function openRecipeForm(id){
  editingRid=id;
  const r=id?recipes[id]:null;
  pendingPhoto=null;rFormCat=r?r.category:null;rFormServ=r?(r.servings||4):4;
  document.getElementById('m-title').textContent=r?'Edit Recipe':'New Recipe';
  document.getElementById('m-body').innerHTML=`
    <div class="fg">
      <label class="fl">Photo</label>
      <div class="pzone" id="pzone">
        ${r&&r.photoURL?`<img src="${r.photoURL}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`:`<div class="pzone-hint">📷 Tap to add photo from camera roll</div>`}
        <input type="file" accept="image/*" onchange="handlePhoto(event)">
      </div>
      <div class="upwrap" id="upwrap"><div class="upbar" id="upbar"></div></div>
    </div>
    <div class="fg"><label class="fl">Recipe Name *</label><input type="text" class="fi" id="rn" placeholder="e.g. Classic Sourdough Loaf" value="${r?esc(r.name):''}"></div>
    <div class="fg">
      <label class="fl">Category *</label>
      <div class="cat-grid" id="cgrid">${CATS.map(c=>`<button class="catb ${rFormCat===c.id?'sel':''}" onclick="selCat('${c.id}')">${c.emoji} ${c.label}</button>`).join('')}</div>
    </div>
    <div class="fg">
      <label class="fl">Servings</label>
      <div class="sv-ctr">
        <button class="sv-btn" onclick="adjFServ(-1)">−</button>
        <span class="sv-num" id="fsv">${rFormServ}</span>
        <span style="font-size:13px;color:var(--mut)">servings</span>
        <button class="sv-btn" onclick="adjFServ(1)">+</button>
      </div>
    </div>
    <div class="fg">
      <label class="fl">Ingredients</label>
      <div id="ilist"></div>
      <button class="btn btn-s btn-sm" onclick="addIR()" style="margin-top:6px">+ Add Ingredient</button>
    </div>
    <div class="fg"><label class="fl">Notes / Instructions</label><textarea class="fta" id="rnotes" placeholder="Steps, tips, temperature, timing...">${r?esc(r.notes||''):''}</textarea></div>
    <div class="fg" style="display:flex;align-items:center;gap:10px">
      <input type="checkbox" id="rrot" ${r&&r.regularRotation?'checked':''} style="width:20px;height:20px;accent-color:var(--acc)">
      <label for="rrot" style="font-size:14px;font-weight:700;color:var(--txt);cursor:pointer">⭐ Regular rotation</label>
    </div>
    <div style="display:flex;gap:8px;margin-top:8px;padding-bottom:8px">
      <button class="btn btn-s" onclick="closeModal()" style="flex:1">Cancel</button>
      <button class="btn btn-p" id="sbtn" onclick="saveRF()" style="flex:1">Save Recipe</button>
    </div>
  `;
  const ings=r&&r.ingredients?r.ingredients:[];
  ings.forEach(i=>addIR(i.qty,i.name));
  if(!ings.length)addIR('','');
  showModal();
}

function selCat(id){
  rFormCat=id;
  document.getElementById('cgrid').innerHTML=CATS.map(c=>`<button class="catb ${rFormCat===c.id?'sel':''}" onclick="selCat('${c.id}')">${c.emoji} ${c.label}</button>`).join('');
}
function adjFServ(d){rFormServ=Math.max(1,rFormServ+d);const el=document.getElementById('fsv');if(el)el.textContent=rFormServ;}
function handlePhoto(e){
  const file=e.target.files[0];if(!file)return;
  pendingPhoto=file;
  const reader=new FileReader();
  reader.onload=ev=>{
    const zone=document.getElementById('pzone');
    const inp=zone.querySelector('input');
    zone.innerHTML='';
    const img=document.createElement('img');
    img.src=ev.target.result;
    img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
    zone.appendChild(img);if(inp)zone.appendChild(inp);
  };
  reader.readAsDataURL(file);
}
function addIR(qty='',name=''){
  const list=document.getElementById('ilist');
  const row=document.createElement('div');
  row.className='ir';
  row.innerHTML=`
    <input type="text" class="iq" placeholder="Qty" value="${esc(qty)}" style="width:82px;flex-shrink:0;padding:10px 10px;border:1.5px solid var(--bor);border-radius:8px;font-size:14px;background:var(--sur);color:var(--txt)">
    <input type="text" class="in" placeholder="Ingredient" value="${esc(name)}" style="flex:1;padding:10px 10px;border:1.5px solid var(--bor);border-radius:8px;font-size:14px;background:var(--sur);color:var(--txt)">
    <button class="del-ir" onclick="this.parentElement.remove()">×</button>
  `;
  list.appendChild(row);
}
async function saveRF(){
  const name=document.getElementById('rn').value.trim();
  if(!name){alert('Please enter a recipe name.');return;}
  if(!rFormCat){alert('Please select a category.');return;}
  const notes=document.getElementById('rnotes').value.trim();
  const rot=document.getElementById('rrot').checked;
  const ingredients=[];
  document.querySelectorAll('#ilist .ir').forEach(row=>{
    const q=row.querySelector('.iq').value.trim();
    const n=row.querySelector('.in').value.trim();
    if(n)ingredients.push({qty:q,name:n});
  });
  const rid=editingRid||('r_'+Date.now());
  let photoURL=(editingRid&&recipes[editingRid]?.photoURL)||null;
  if(pendingPhoto){
    const btn=document.getElementById('sbtn');if(btn)btn.textContent='Uploading...';
    document.getElementById('upwrap').style.display='block';
    try{
      const blob=await compressImg(pendingPhoto,900,.82);
      const ref=storage.ref('recipes/'+rid+'/photo.jpg');
      const task=ref.put(blob,{contentType:'image/jpeg'});
      task.on('state_changed',snap=>{document.getElementById('upbar').style.width=(snap.bytesTransferred/snap.totalBytes*100)+'%';});
      await task;photoURL=await ref.getDownloadURL();
    }catch(err){console.error(err);alert('Photo upload failed — saved without photo.');}
    pendingPhoto=null;
  }
  const data={name,category:rFormCat,notes,ingredients,servings:rFormServ,regularRotation:rot,favorite:!!(editingRid&&recipes[editingRid]?.favorite),photoURL:photoURL||null,updatedAt:new Date().toISOString()};
  if(!editingRid)data.createdAt=new Date().toISOString();
  await db.ref('/recipes/'+rid).update(data);
  closeModal();
}
function confirmDel(id){
  if(!confirm('Delete "'+( recipes[id]?.name||'this recipe')+'"?\nCannot be undone.'))return;
  db.ref('/recipes/'+id).remove();closeModal();
}

// ============================================================
// IDEAS
// ============================================================
function openIdeaForm(id){
  const idea=id?ideas[id]:null;
  pendingPhoto=null;
  document.getElementById('m-title').textContent=idea?'Edit Idea':'New Meal Idea';
  document.getElementById('m-body').innerHTML=`
    <div class="fg">
      <label class="fl">Photo (optional)</label>
      <div class="pzone" id="pzone">
        ${idea&&idea.photoURL?`<img src="${idea.photoURL}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`:`<div class="pzone-hint">📷 Add a photo of inspiration</div>`}
        <input type="file" accept="image/*" onchange="handlePhoto(event)">
      </div>
      <div class="upwrap" id="upwrap"><div class="upbar" id="upbar"></div></div>
    </div>
    <div class="fg"><label class="fl">Idea Name *</label><input type="text" class="fi" id="idea-name" placeholder="e.g. Thai basil chicken" value="${idea?esc(idea.name):''}"></div>
    <div class="fg"><label class="fl">Notes</label><textarea class="fta" id="idea-notes" placeholder="Rough notes, where you saw it...">${idea?esc(idea.notes||''):''}</textarea></div>
    <div style="display:flex;gap:8px;margin-top:8px;padding-bottom:8px">
      <button class="btn btn-s" onclick="closeModal()" style="flex:1">Cancel</button>
      <button class="btn btn-p" id="sbtn" onclick="saveIdea('${id||''}')" style="flex:1">Save Idea</button>
    </div>
  `;
  showModal();
}

async function saveIdea(id){
  const name=document.getElementById('idea-name').value.trim();
  if(!name){alert('Enter an idea name.');return;}
  const notes=document.getElementById('idea-notes').value.trim();
  const iid=id||('idea_'+Date.now());
  let photoURL=(id&&ideas[id]?.photoURL)||null;
  if(pendingPhoto){
    const btn=document.getElementById('sbtn');if(btn)btn.textContent='Uploading...';
    document.getElementById('upwrap').style.display='block';
    try{
      const blob=await compressImg(pendingPhoto,900,.82);
      const ref=storage.ref('ideas/'+iid+'/photo.jpg');
      const task=ref.put(blob,{contentType:'image/jpeg'});
      task.on('state_changed',snap=>{document.getElementById('upbar').style.width=(snap.bytesTransferred/snap.totalBytes*100)+'%';});
      await task;photoURL=await ref.getDownloadURL();
    }catch(err){console.error(err);}
    pendingPhoto=null;
  }
  await db.ref('/ideas/'+iid).update({name,notes,photoURL:photoURL||null,updatedAt:new Date().toISOString()});
  closeModal();
}

function openIdeaDetail(id){
  const idea=ideas[id];if(!idea)return;
  document.getElementById('m-title').textContent=esc(idea.name);
  document.getElementById('m-body').innerHTML=`
    ${idea.photoURL?`<img class="r-det-img" src="${idea.photoURL}">`:''}
    ${idea.notes?`<p style="font-size:15px;line-height:1.6;color:var(--txt);margin-bottom:16px">${esc(idea.notes)}</p>`:''}
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <button class="btn btn-p" onclick="promoteIdea('${id}')" style="flex:1">✨ Promote to Recipe</button>
      <button class="btn btn-s btn-sm" onclick="openIdeaForm('${id}')">✏️ Edit</button>
      <button class="btn btn-d btn-sm" onclick="deleteIdea('${id}')">🗑️</button>
    </div>
  `;
  showModal();
}

function promoteIdea(id){
  const idea=ideas[id];if(!idea)return;
  closeModal();
  // Open recipe form pre-filled with idea name
  editingRid=null;pendingPhoto=null;rFormCat=null;rFormServ=4;
  document.getElementById('m-title').textContent='New Recipe from Idea';
  // slight delay for modal to close/reopen
  setTimeout(()=>{
    openRecipeForm(null);
    setTimeout(()=>{
      const el=document.getElementById('rn');
      if(el)el.value=idea.name;
      const notesEl=document.getElementById('rnotes');
      if(notesEl&&idea.notes)notesEl.value=idea.notes;
    },50);
  },300);
}

function deleteIdea(id){
  if(!confirm('Delete this idea?'))return;
  db.ref('/ideas/'+id).remove();closeModal();
}

// ============================================================
// CALENDAR
// ============================================================
function renderCalendar(){
  const el=document.getElementById('c-body');
  const dates=getWeekDates(wkOff);
  const s=new Date(dates[0]+'T12:00:00'),e=new Date(dates[6]+'T12:00:00');
  el.innerHTML=`
    <div class="wknav">
      <button class="wkbtn" onclick="chWk(-1)">‹</button>
      <span class="wklbl">${s.toLocaleDateString('en',{month:'short',day:'numeric'})} – ${e.toLocaleDateString('en',{month:'short',day:'numeric'})}</span>
      <button class="wkbtn" onclick="chWk(1)">›</button>
    </div>
    ${dates.map(ds=>dCardHtml(ds)).join('')}
    <div style="height:16px"></div>
  `;
}

function dCardHtml(ds){
  const d=new Date(ds+'T12:00:00'),isT=ds===fmtD(new Date());
  const day=calD[ds]||{},sd=day.sourdough;
  const slotsHtml=SLOTS.map(slot=>{
    const rid=day[slot.id],r=rid?recipes[rid]:null;
    return `<div class="mslot">
      <span class="mslot-lbl">${slot.label}</span>
      ${r
        ?`<span class="mslot-val" onclick="openRecipeDetail('${rid}')">${esc(r.name)}</span>
          <button class="s-rm" onclick="rmSlot('${ds}','${slot.id}')">×</button>`
        :`<span class="mslot-emp">—</span>
          <button class="s-add" onclick="openSlotPicker('${ds}','${slot.id}')">+</button>`
      }
    </div>`;
  }).join('');
  return `<div class="dcard">
    <div class="dhdr">
      <span class="dname ${isT?'tod':''}">${d.toLocaleDateString('en',{weekday:'long'})}${isT?' · Today':''}</span>
      <div style="display:flex;align-items:center;gap:8px">
        ${sd?`<span class="sd-badge">${sd.emoji} ${sd.label}</span>`:''}
        <span class="ddate">${d.toLocaleDateString('en',{month:'short',day:'numeric'})}</span>
      </div>
    </div>
    ${slotsHtml}
    <div class="dnote-row">
      <input type="text" class="dnote-in" placeholder="📝 Day note..." value="${esc(day.note||'')}" onchange="saveDNote('${ds}',this.value)">
    </div>
  </div>`;
}

function chWk(d){wkOff+=d;renderCalendar();}
function saveDNote(ds,v){db.ref('/calendar/'+ds+'/note').set(v||null);}
function rmSlot(ds,slot){db.ref('/calendar/'+ds+'/'+slot).remove();}

function openSlotPicker(ds,slot){
  const slotDef=SLOTS.find(s=>s.id===slot);
  const allowed=slotDef?slotDef.cats:[];
  const filtered=Object.entries(recipes).filter(([,r])=>allowed.includes(r.category));
  document.getElementById('m-title').textContent='Add to '+(slotDef?.label||slot);
  document.getElementById('m-body').innerHTML=filtered.length
    ?`<div>${filtered.map(([id,r])=>{
        const c=CM[r.category];
        return `<div class="picker-item" onclick="assignSlot('${ds}','${slot}','${id}')">
          ${r.photoURL?`<img class="picker-th" src="${r.photoURL}" loading="lazy">`:`<div class="picker-ph">${c?.emoji||'🍽️'}</div>`}
          <div>
            <div style="font-weight:700;font-size:15px;color:var(--txt)">${esc(r.name)}</div>
            ${c?`<span class="pill ${c.cls}" style="margin-top:4px">${c.emoji} ${c.label}</span>`:''}
          </div>
        </div>`;
      }).join('')}</div>`
    :`<div class="empty" style="padding:24px 0"><div class="ei">📖</div><p>No ${allowed.join(' or ')} recipes yet.<br>Add some in Recipes first!</p></div>
      <button class="btn btn-s btn-full" onclick="closeModal()">Close</button>`;
  showModal();
}

function assignSlot(ds,slot,rid){db.ref('/calendar/'+ds+'/'+slot).set(rid);closeModal();}

// ============================================================
// SHOPPING
// ============================================================
function renderShopping(){
  const el=document.getElementById('s-body');
  const unc=shopItems.filter(i=>!i.checked).length;
  const tripCount=Object.keys(trips).length;
  el.innerHTML=`
    <div class="shop-tabs">
      <button class="stab ${shopTab==='list'?'active':''}" onclick="setShopTab('list')">🛒 My List (${unc})</button>
      <button class="stab ${shopTab==='trips'?'active':''}" onclick="setShopTab('trips')">✈️ Trips (${tripCount})</button>
      <button class="stab ${shopTab==='staples'?'active':''}" onclick="setShopTab('staples')">📦 Staples</button>
    </div>
    <div id="stab-body"></div>
  `;
  renderShopTab();
}

function setShopTab(t){shopTab=t;renderShopping();}

function renderShopTab(){
  const el=document.getElementById('stab-body');if(!el)return;
  if(shopTab==='list'){
    const unc=shopItems.filter(i=>!i.checked);
    const chk=shopItems.filter(i=>i.checked);
    el.innerHTML=`
      <div style="padding:12px 16px;background:var(--sur);border-bottom:1.5px solid var(--bor);display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-pri btn-sm" onclick="genFromCal()">📅 Generate from this week</button>
        <button class="btn btn-s btn-sm" onclick="openAddItemModal()">+ Add item</button>
        ${chk.length?`<button class="btn btn-s btn-sm" onclick="clearChk()">Clear got it (${chk.length})</button>`:''}
      </div>
      ${!shopItems.length
        ?`<div class="empty"><div class="ei">🛒</div><p>Your list is empty.<br>Generate from your meal plan or add items manually.</p></div>`
        :`<div class="slist">
            ${unc.map(item=>sItemHtml(item,shopItems.indexOf(item))).join('')}
            ${chk.length?`<div style="padding:10px 0 4px;font-size:11px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.6px">Got it ✓ (${chk.length})</div>
            ${chk.map(item=>sItemHtml(item,shopItems.indexOf(item))).join('')}`:''}
          </div>`
      }
      <div style="height:16px"></div>
    `;
  } else if(shopTab==='trips'){
    const tripList=Object.entries(trips).sort((a,b)=>(b[1].createdAt||'').localeCompare(a[1].createdAt||''));
    el.innerHTML=`
      <div style="padding:12px 16px;background:var(--sur);border-bottom:1.5px solid var(--bor)">
        <p style="font-size:13px;color:var(--mut);margin-bottom:10px">Separate shopping lists for trips, holidays, or special occasions</p>
        <button class="btn btn-p btn-sm" onclick="openNewTripModal()">+ New Trip List</button>
      </div>
      ${tripList.length
        ?`<div style="padding:12px 0">${tripList.map(([id,t])=>`
            <div class="trip-card" onclick="openTrip('${id}')">
              <div>
                <div class="trip-name">${esc(t.name)}</div>
                <div class="trip-meta">${(t.items||[]).length} items · ${(t.items||[]).filter(i=>i.checked).length} got it</div>
              </div>
              <div style="display:flex;gap:8px;align-items:center">
                <span style="font-size:24px">✈️</span>
                <button class="btn btn-d btn-sm" onclick="deleteTrip(event,'${id}')">🗑️</button>
              </div>
            </div>`).join('')}</div>`
        :`<div class="empty"><div class="ei">✈️</div><p>No trip lists yet.<br>Perfect for vacation grocery runs,<br>holiday meals, camping trips!</p></div>`
      }
      <div style="height:16px"></div>
    `;
  } else {
    el.innerHTML=`
      <div style="padding:12px 16px;background:var(--sur);border-bottom:1.5px solid var(--bor)">
        <p style="font-size:13px;color:var(--mut);margin-bottom:10px">Check what you need → Add to My List</p>
        <div style="display:flex;gap:8px">
          <button class="btn btn-p btn-sm" onclick="addStaplesToList()">+ Add checked to My List</button>
          <button class="btn btn-s btn-sm" onclick="openAddStapleModal()">+ New staple</button>
        </div>
      </div>
      <div class="slist">${shopStaples.map((item,idx)=>stapleHtml(item,idx)).join('')}</div>
      <div style="height:16px"></div>
    `;
  }
}

function sItemHtml(item,idx){
  return `<div class="sitem">
    <button class="schk ${item.checked?'done':''}" onclick="togShop(${idx})">${item.checked?'✓':''}</button>
    <div style="flex:1;min-width:0">
      <div class="sname ${item.checked?'done':''}">${esc(item.name)}</div>
      ${item.source?`<div class="ssrc">from ${esc(item.source)}</div>`:''}
    </div>
    <span class="sqty">${esc(item.qty||'')}</span>
    <button class="sdel" onclick="delShop(${idx})">×</button>
  </div>`;
}

function stapleHtml(item,idx){
  return `<div class="sitem">
    <button class="schk ${item.checked?'done':''}" onclick="togStaple(${idx})">${item.checked?'✓':''}</button>
    <span class="sname ${item.checked?'done':''}" style="flex:1">${esc(item.name)}</span>
    <button class="sdel" onclick="delStaple(${idx})">×</button>
  </div>`;
}

function togShop(idx){const it=[...shopItems];it[idx]={...it[idx],checked:!it[idx].checked};db.ref('/shopping/items').set(it);}
function delShop(idx){db.ref('/shopping/items').set(shopItems.filter((_,i)=>i!==idx));}
function clearChk(){db.ref('/shopping/items').set(shopItems.filter(i=>!i.checked));}
function togStaple(idx){const s=[...shopStaples];s[idx]={...s[idx],checked:!s[idx].checked};db.ref('/shopping/staples').set(s);}
function delStaple(idx){
  if(!confirm('Remove "'+shopStaples[idx].name+'" from staples?'))return;
  db.ref('/shopping/staples').set(shopStaples.filter((_,i)=>i!==idx));
}
function addStaplesToList(){
  const toAdd=shopStaples.filter(s=>s.checked);
  if(!toAdd.length){alert('Check some staples first.');return;}
  db.ref('/shopping/items').set([...shopItems,...toAdd.map(s=>({name:s.name,qty:'',checked:false,source:'Staples'}))]);
  db.ref('/shopping/staples').set(shopStaples.map(s=>({...s,checked:false})));
  setShopTab('list');
}

function openAddItemModal(){
  document.getElementById('m-title').textContent='+ Add Item';
  document.getElementById('m-body').innerHTML=`
    <div class="fg"><label class="fl">Item Name</label><input type="text" class="fi" id="ni-name" placeholder="e.g. Sourdough flour"></div>
    <div class="fg"><label class="fl">Quantity (optional)</label><input type="text" class="fi" id="ni-qty" placeholder="e.g. 2 lbs"></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-s" onclick="closeModal()" style="flex:1">Cancel</button>
      <button class="btn btn-p" onclick="doAddItem()" style="flex:1">Add to List</button>
    </div>
  `;
  showModal();
  setTimeout(()=>document.getElementById('ni-name')?.focus(),300);
}

function doAddItem(){
  const name=document.getElementById('ni-name').value.trim();
  if(!name){alert('Enter an item name.');return;}
  const qty=document.getElementById('ni-qty').value.trim();
  db.ref('/shopping/items').set([...shopItems,{name,qty,checked:false,source:''}]);
  closeModal();
}

function openAddStapleModal(){
  document.getElementById('m-title').textContent='+ New Staple';
  document.getElementById('m-body').innerHTML=`
    <div class="fg"><label class="fl">Staple Item</label><input type="text" class="fi" id="ns-name" placeholder="e.g. Coconut oil"></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-s" onclick="closeModal()" style="flex:1">Cancel</button>
      <button class="btn btn-p" onclick="doAddStaple()" style="flex:1">Add Staple</button>
    </div>
  `;
  showModal();
}

function doAddStaple(){
  const name=document.getElementById('ns-name').value.trim();
  if(!name){alert('Enter an item name.');return;}
  db.ref('/shopping/staples').set([...shopStaples,{name,qty:'',checked:false}]);
  closeModal();
}

function genFromCal(){
  const dates=getWeekDates(0);
  const ingMap={};
  dates.forEach(ds=>{
    const day=calD[ds]||{};
    SLOTS.forEach(slot=>{
      const rid=day[slot.id];if(!rid)return;
      const r=recipes[rid];if(!r||!r.ingredients)return;
      r.ingredients.forEach(i=>{
        const key=i.name.toLowerCase().trim();
        if(!ingMap[key])ingMap[key]={name:i.name,qtys:[],source:r.name};
        if(i.qty)ingMap[key].qtys.push(i.qty);
      });
    });
  });
  const gen=Object.values(ingMap).map(i=>({name:i.name,qty:i.qtys.join(' + ')||'',checked:false,source:'Meal plan'}));
  if(!gen.length){alert('No meals planned this week yet. Add recipes to the calendar first!');return;}
  const exMap={};shopItems.forEach(i=>{exMap[i.name.toLowerCase()]=i.checked;});
  gen.forEach(i=>{if(exMap[i.name.toLowerCase()])i.checked=true;});
  const manual=shopItems.filter(i=>i.source!=='Meal plan');
  db.ref('/shopping/items').set([...manual,...gen]);
}

// TRIPS
function openNewTripModal(){
  document.getElementById('m-title').textContent='✈️ New Trip List';
  document.getElementById('m-body').innerHTML=`
    <div class="fg"><label class="fl">Trip Name</label><input type="text" class="fi" id="trip-name" placeholder="e.g. Lake Tahoe Weekend, Thanksgiving, Camping"></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-s" onclick="closeModal()" style="flex:1">Cancel</button>
      <button class="btn btn-p" onclick="doNewTrip()" style="flex:1">Create List</button>
    </div>
  `;
  showModal();
}

function doNewTrip(){
  const name=document.getElementById('trip-name').value.trim();
  if(!name){alert('Enter a trip name.');return;}
  const id='trip_'+Date.now();
  db.ref('/shopping/trips/'+id).set({name,items:[],createdAt:new Date().toISOString()});
  closeModal();
  setTimeout(()=>openTrip(id),400);
}

function openTrip(id){
  activeTripId=id;
  const trip=trips[id];if(!trip)return;
  const items=trip.items||[];
  const unc=items.filter(i=>!i.checked);
  const chk=items.filter(i=>i.checked);
  document.getElementById('m-title').textContent='✈️ '+esc(trip.name);
  document.getElementById('m-body').innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <button class="btn btn-p btn-sm" onclick="openAddTripItemModal()">+ Add Item</button>
      ${chk.length?`<button class="btn btn-s btn-sm" onclick="clearTripChk()">Clear got it (${chk.length})</button>`:''}
      <span style="font-size:13px;color:var(--mut);align-self:center;margin-left:auto">${unc.length} remaining</span>
    </div>
    ${!items.length
      ?`<div class="empty" style="padding:24px 0"><div class="ei">🛍️</div><p>No items yet.<br>Start adding to your trip list!</p></div>`
      :`<div>
          ${unc.map(item=>tripItemHtml(item,items.indexOf(item))).join('')}
          ${chk.length?`<div style="padding:10px 0 4px;font-size:11px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.6px">Got it ✓</div>
          ${chk.map(item=>tripItemHtml(item,items.indexOf(item))).join('')}`:''}
        </div>`
    }
    <div style="height:8px"></div>
  `;
  showModal();
}

function tripItemHtml(item,idx){
  return `<div class="sitem">
    <button class="schk ${item.checked?'done':''}" onclick="togTripItem(${idx})">${item.checked?'✓':''}</button>
    <span class="sname ${item.checked?'done':''}" style="flex:1">${esc(item.name)}</span>
    <span class="sqty">${esc(item.qty||'')}</span>
    <button class="sdel" onclick="delTripItem(${idx})">×</button>
  </div>`;
}

function openAddTripItemModal(){
  document.getElementById('m-title').textContent='+ Add to Trip';
  document.getElementById('m-body').innerHTML=`
    <div class="fg"><label class="fl">Item Name</label><input type="text" class="fi" id="ti-name" placeholder="e.g. Sunscreen"></div>
    <div class="fg"><label class="fl">Quantity (optional)</label><input type="text" class="fi" id="ti-qty" placeholder="e.g. 1 bottle"></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-s" onclick="openTrip('${activeTripId}')" style="flex:1">← Back</button>
      <button class="btn btn-p" onclick="doAddTripItem()" style="flex:1">Add Item</button>
    </div>
  `;
  setTimeout(()=>document.getElementById('ti-name')?.focus(),300);
}

function doAddTripItem(){
  const name=document.getElementById('ti-name').value.trim();
  if(!name){alert('Enter an item name.');return;}
  const qty=document.getElementById('ti-qty').value.trim();
  const trip=trips[activeTripId];if(!trip)return;
  const items=[...(trip.items||[]),{name,qty,checked:false}];
  db.ref('/shopping/trips/'+activeTripId+'/items').set(items);
  setTimeout(()=>openTrip(activeTripId),300);
}

function togTripItem(idx){
  const trip=trips[activeTripId];if(!trip)return;
  const items=(trip.items||[]).map((item,i)=>i===idx?{...item,checked:!item.checked}:item);
  db.ref('/shopping/trips/'+activeTripId+'/items').set(items);
  setTimeout(()=>openTrip(activeTripId),200);
}

function delTripItem(idx){
  const trip=trips[activeTripId];if(!trip)return;
  const items=(trip.items||[]).filter((_,i)=>i!==idx);
  db.ref('/shopping/trips/'+activeTripId+'/items').set(items);
  setTimeout(()=>openTrip(activeTripId),200);
}

function clearTripChk(){
  const trip=trips[activeTripId];if(!trip)return;
  db.ref('/shopping/trips/'+activeTripId+'/items').set((trip.items||[]).filter(i=>!i.checked));
  setTimeout(()=>openTrip(activeTripId),200);
}

function deleteTrip(e,id){
  e.stopPropagation();
  if(!confirm('Delete "'+trips[id]?.name+'" trip list?'))return;
  db.ref('/shopping/trips/'+id).remove();
}

// ============================================================
// STARTER
// ============================================================
function openStarter(){document.getElementById('s-ov').classList.add('open');renderStarter();}
function closeStarter(){document.getElementById('s-ov').classList.remove('open');}

function renderStarter(){
  const el=document.getElementById('s-inner');
  const ss=getStStatus();
  const lastFedTxt=starterD.lastFed?timeAgo(new Date(starterD.lastFed)):'Not logged yet';
  const nxt=getNextFeed();
  const logEntries=Object.entries(bakeLog).sort((a,b)=>(b[1].loggedAt||'').localeCompare(a[1].loggedAt||''));
  el.innerHTML=`
    <div class="sc-card">
      <div class="sc-top">
        <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:600">Starter Status</span>
        <span class="sc-badge">${ss.emoji} ${ss.label}</span>
      </div>
      <div class="sc-meta">
        <div class="sc-box"><div class="v">${lastFedTxt}</div><div class="l">Last Fed</div></div>
        <div class="sc-box"><div class="v">${nxt}</div><div class="l">Feed By</div></div>
      </div>
      <div class="ltog">
        <button class="lbtn ${starterD.location==='counter'?'active':''}" onclick="setLoc('counter')">🍶 Room Temp</button>
        <button class="lbtn ${starterD.location==='fridge'?'active':''}" onclick="setLoc('fridge')">🧊 Fridge</button>
      </div>
      <div style="padding:10px 14px 0">
        <input type="text" placeholder="🌡️ Temperature note (e.g. kitchen is warm today)..." value="${esc(starterD.tempNote||'')}" onchange="saveTempNote(this.value)"
          style="width:100%;padding:9px 12px;border:1.5px solid var(--bor);border-radius:8px;font-size:14px;background:var(--sur);color:var(--txt)">
      </div>
      <div class="sc-acts">
        <button class="btn btn-p" onclick="feedStarter()" style="flex:1">✅ Fed It!</button>
      </div>
    </div>
    <div style="margin:0 16px">
      <p class="sub-h">🗓️ Set Bake Day</p>
      <input type="date" id="bd-in" value="${starterD.bakeDay||fmtD(new Date())}" min="${fmtD(new Date())}" onchange="prevBS(this.value)">
      <div id="bd-prev" style="margin-top:10px">${starterD.bakeDay?renderBS(starterD.bakeDay):''}</div>
      <button class="btn btn-p btn-full" onclick="confBakeDay()" style="margin-top:10px">Set Schedule on Calendar</button>
      ${starterD.bakeDay?`<button class="btn btn-s btn-full" onclick="clrBakeDay()" style="margin-top:8px">Clear Schedule</button>`:''}
    </div>
    <div style="margin:16px 16px 0">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <p class="sub-h" style="margin:0">🥖 Bake Log</p>
        <button class="btn btn-g btn-sm" onclick="openBakeLogModal()">+ Log a Bake</button>
      </div>
      ${logEntries.length
        ?logEntries.slice(0,15).map(([,e])=>`<div class="blog-entry"><div class="blog-date">${e.date||''}</div><div style="font-size:14px;color:var(--txt)">${esc(e.note||'')}</div></div>`).join('')
        :`<div style="padding:16px 0;text-align:center;color:var(--mut);font-size:14px">No bakes logged yet.</div>`
      }
    </div>
    <div style="height:24px"></div>
  `;
}

function renderBS(bakeDay){
  const bd=new Date(bakeDay+'T12:00:00');
  return `<div class="bsched">${SD.map(s=>{
    const d=addDays(bd,s.offset);
    return `<div class="bsrow"><span class="bsdate">${d.toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})}</span><span>${s.emoji} ${s.label}</span></div>`;
  }).join('')}</div>`;
}
function prevBS(v){const el=document.getElementById('bd-prev');if(el&&v)el.innerHTML=renderBS(v);}
function confBakeDay(){
  const v=document.getElementById('bd-in')?.value;if(!v)return;
  db.ref('/starter').update({bakeDay:v});
  const bd=new Date(v+'T12:00:00');
  SD.forEach(s=>{const d=addDays(bd,s.offset);db.ref('/calendar/'+fmtD(d)+'/sourdough').set({emoji:s.emoji,label:s.label});});
}
function clrBakeDay(){if(!confirm('Clear the bake day schedule?'))return;db.ref('/starter').update({bakeDay:null});}
function feedStarter(){db.ref('/starter').update({lastFed:new Date().toISOString()});}
function setLoc(loc){db.ref('/starter').update({location:loc});}
function saveTempNote(v){db.ref('/starter').update({tempNote:v});}
function getStStatus(){
  if(!starterD.lastFed)return{emoji:'❓',label:'Not tracked'};
  const hrs=(Date.now()-new Date(starterD.lastFed))/3600000;
  if(starterD.location==='fridge'){
    if(hrs<120)return{emoji:'🟢',label:'Happy'};
    if(hrs<168)return{emoji:'🟡',label:'Feed Soon'};
    return{emoji:'🔴',label:'Feed Now!'};
  }
  if(hrs<6)return{emoji:'🟢',label:'Happy'};
  if(hrs<10)return{emoji:'🟡',label:'Feed Soon'};
  return{emoji:'🔴',label:'Feed Now!'};
}
function getNextFeed(){
  if(!starterD.lastFed)return'—';
  const hrs=starterD.location==='fridge'?120:8;
  const next=new Date(new Date(starterD.lastFed).getTime()+hrs*3600000);
  const diff=next-Date.now();
  if(diff<0)return'Now!';
  const h=Math.floor(diff/3600000);
  if(h<1)return'Very soon!';
  if(h<24)return'In '+h+'h';
  return'In '+Math.floor(h/24)+'d';
}
function openBakeLogModal(){
  document.getElementById('m-title').textContent='🥖 Log a Bake';
  document.getElementById('m-body').innerHTML=`
    <div class="fg"><label class="fl">Date</label><input type="date" id="bl-date" value="${fmtD(new Date())}"></div>
    <div class="fg"><label class="fl">Notes</label><textarea class="fta" id="bl-note" placeholder="e.g. 2 sourdough loaves, great oven spring, 450°F 45 min"></textarea></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-s" onclick="closeModal()" style="flex:1">Cancel</button>
      <button class="btn btn-p" onclick="doLogBake()" style="flex:1">Save Log</button>
    </div>
  `;
  showModal();
}
function doLogBake(){
  const date=document.getElementById('bl-date').value;
  const note=document.getElementById('bl-note').value.trim();
  if(!note){alert('Add a note about your bake.');return;}
  db.ref('/starter/log').push({date,note,loggedAt:new Date().toISOString()});
  closeModal();
}

// ============================================================
// MODAL
// ============================================================
function showModal(){document.getElementById('m-ov').classList.add('open');document.body.style.overflow='hidden';}
function closeModal(){document.getElementById('m-ov').classList.remove('open');document.body.style.overflow='';pendingPhoto=null;}
function handleOvClick(e){if(e.target===document.getElementById('m-ov'))closeModal();}

// ============================================================
// IMAGE COMPRESSION
// ============================================================
function compressImg(file,maxW,quality){
  return new Promise(resolve=>{
    const img=new Image(),url=URL.createObjectURL(file);
    img.onload=()=>{
      let w=img.width,h=img.height;
      if(w>maxW){h=Math.round(h*maxW/w);w=maxW;}
      const c=document.createElement('canvas');
      c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
      URL.revokeObjectURL(url);
      c.toBlob(blob=>resolve(blob),'image/jpeg',quality);
    };
    img.src=url;
  });
}

// ============================================================
// SCALE QUANTITY
// ============================================================
function scaleQ(qty,factor){
  if(!qty||factor===1)return qty||'';
  const m=String(qty).match(/^([\d.]+(?:\/[\d.]+)?)\s*(.*)/);
  if(!m)return qty;
  let n=m[1].includes('/')?parseFloat(m[1].split('/')[0])/parseFloat(m[1].split('/')[1]):parseFloat(m[1]);
  if(isNaN(n))return qty;
  const sc=n*factor;
  return(sc%1===0?sc.toString():parseFloat(sc.toFixed(2)).toString())+(m[2]?' '+m[2]:'');
}

// ============================================================
// UTILITIES
// ============================================================
function getWeekDates(off){
  const now=new Date(),start=new Date(now);
  start.setDate(now.getDate()-now.getDay()+off*7);start.setHours(0,0,0,0);
  return Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return fmtD(d);});
}
function fmtD(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function addDays(date,n){const d=new Date(date);d.setDate(d.getDate()+n);return d;}
function timeAgo(date){
  const m=Math.floor((Date.now()-date)/60000);
  if(m<1)return'just now';if(m<60)return m+'m ago';
  const h=Math.floor(m/60);if(h<24)return h+'h ago';
  return Math.floor(h/24)+'d ago';
}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('fab').style.display='none';
  initFB();renderDash();
});
</script>
</body>
</html>
# Keep-on-Baking
