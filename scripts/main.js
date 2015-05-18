(function () {
  'use strict';

  // Event Utility Boilerplate Code
  var EventUtil =  {
    addHandler: function(element, event, handler) {
      if (element.addEventListener) {
        element.addEventListener(event, handler);
      } else if (element.attachEvent) {
        element.attachEvent('on' + event, handler);
      } else {
        element['on' + event] = handler;
      }
    },

    getEvent: function(event) {
      return event ? event : window.event;
    },

    getTarget: function(event) {
      return event.target || event.srcElement;
    }
  };

    // Gets the index of li element in an ol or ul
  function getNodeIndex(node) {
    var index = 0;
    while ( (node = node.previousSibling) ) {
        if (node.nodeType !== 3 || !/^\s*$/.test(node.data)) {
            index++;
        }
    }
    return index;
  }

  function updateJSONTextArea() {
    jsonItems.value = JSON.stringify(itemListArr);
  }

  function addToList(item) {
    if (!item.value) {
      window.alert('The field is empty. Please input a value to add');
      return;
    }

    itemListArr.push(item.value);
    updateList(item);
  }

  function clearList() {
    while(itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
  }

  function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if ((val += 0.1) < 1) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  function updateList(item) {
    var newItem         = document.createElement('li'),
        newItemText     = document.createTextNode(item.value),
        newItemLink     = document.createElement('a'),
        newItemLinkText = document.createTextNode('delete');

    newItemLink.id = 'delete-' + (itemListArr.length - 1);
    newItemLink.appendChild(newItemLinkText);
    newItem.appendChild(newItemText);
    newItem.appendChild(newItemLink);
    itemList.appendChild(newItem);
    fadeIn(newItem);
    updateJSONTextArea();

    item.value='';
  }

  function updateListByJSON() {
    clearList();

    for (var i=0;i<itemListArr.length;i++) {
      var newItem         = document.createElement('li'),
          newItemText     = document.createTextNode(itemListArr[i]),
          newItemLink     = document.createElement('a'),
          newItemLinkText = document.createTextNode('delete');

      newItemLink.id = 'delete-' + i;
      newItemLink.appendChild(newItemLinkText);
      newItem.appendChild(newItemText);
      newItem.appendChild(newItemLink);
      itemList.appendChild(newItem);
      fadeIn(newItem);
    }
  }

  function addJSONToList(jsonItems) {
    try {
      itemListArr = JSON.parse(jsonItems.value);
    } catch(e) {
      window.alert('The JSON inputted is invalid. Please enter a valid JSON String');
    }
    updateListByJSON();
  }

  function fadeOutItem(target) {
    var parent  = target.parentNode;
    var idx     = getNodeIndex(parent);

    transitionType = 'fadeOut';
    document.getElementById('itemList').children[idx].className = 'invisible';
  }

  function removeFromList(target) {
    var idx = getNodeIndex(target);

    target.parentNode.removeChild(target);
    itemListArr.splice(idx, 1);
    updateJSONTextArea();
  }

  // Taken from Modernizer. Normailizes CSS3 Transition function across browsers
  function transitionEndEventName () {
    var i,
        el = document.createElement('div'),
        transitions = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'msTransition'     : 'MSTransitionEnd',
            'transition'       : 'transitionend'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }
  }

  // Initialize list and JSON Text area based on rendered HTML
  function init() {
    var initialList = itemList.getElementsByTagName('li');
      for (var i =0;i<initialList.length;i++) {
        itemListArr.push(initialList[i].childNodes[0].nodeValue);
      }
      jsonItems.value=JSON.stringify(itemListArr);
  }

  // Application variables
  var transitionEnd   = transitionEndEventName(),
      transitionType  = null,
      item            = document.getElementById('addItem'),
      jsonItems       = document.getElementById('addJSON'),
      itemList        = document.getElementById('itemList'),
      itemListArr     = [];

  //Vanilla JS version of document.ready
  document.addEventListener('DOMContentLoaded', function() {
    
    EventUtil.addHandler(document.documentElement, transitionEnd, function(event) {
      var target = EventUtil.getTarget(event);
      if (transitionType) {
        removeFromList(target);
        transitionType = null;
      }
      target.removeAttribute('style');
    });

    // Delegates click events on the entire document. We will only consider elements with an ID
    EventUtil.addHandler(document.documentElement, 'click', function(event) {
      var target = EventUtil.getTarget(event);

      if (target.id) {
        switch(true){
          case(target.id==='add_item'):
            addToList(item);
            break;
          case(target.id==='clearJSON'):
            clearList();
            itemListArr = [];
            jsonItems.value = '';
            break;
          case(target.id==='loadJSON'):
            addJSONToList(jsonItems);
            break;
          case(target.id.toLowerCase().indexOf('delete') > -1):
            fadeOutItem(target);
            break;
        }
      }
    });

    init();
  });

})();
