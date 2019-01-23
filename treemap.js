/*
* JavaScript implementation of java.util.TreeMap Class
*
* The java.util.TreeMap class is the Red-Black tree based implementation
* of the Map interface.Following are the important points about TreeMap:
*
* 1) The TreeMap class guarantees that the Map will be in ascending key order.
*
* 2) The Map is sorted according to the natural sort method for the key Class,
* or by the Comparator provided at map creation time,
* that will depend on which constructor used.
*/

// https://github.com/somdipdey/JavaScript-implementation-of-java.util.TreeMap-Class

export class TreeMap {

	constructor(){
		this.dict = {};
	}

    /*
    * <summary>
    * Value get(Object key)
    * This method returns the value to which the specified key is mapped,
    * or null if this map contains no mapping for the key.
    * </summary>
    */
    get(key){
        return this.dict[key];
    };

    /*
    * <summary>
    * boolean containsKey(Object key)
    * This method returns true
    * if this map contains a mapping for the specified key.
    * </summary>
    */
    containsKey(key){
        if( this.get(key) !== undefined) {
            return true;
        } else {
            return false;
        }
    };

    /*
    * <summary>
    * Value put(K key, V value)
    * This method associates the specified value with the specified key in this map.
    * </summary>
    */
    put(key,value) {
        this.dict[key] = value;
        if(isNumber(key))
        {
          if(allKeysAreNumeral(this.dict)) {
            this.dict = sortOnKeys(this.dict);
          }
        }
    };

    /*
    * <summary>
    * Value remove(Object key)
    * This method removes the mapping for this key from this TreeMap if present.
    * </summary>
    */
    remove(key) {
        'use strict';
        delete this.dict[key];
    };

    /*
    * <summary>
    * void clear()
    * This method removes all of the mappings from this map.
    * </summary>
    */
    clear(){
        this.dict = {};
    };


    /*
    * <summary>
    * treeMap.foreach(V value)
    * This method returns each value for each keys in the TreeMap.
    * </summary>
    */
    forEach(callback) {
        var len = this.size();
        for (var i = 0; i < len; i++) {
            var item = this.get( Object.keys(this.dict)[i] );
            callback(item);
        }
    }


    /*
    * <summary>
    * int size()
    * This method returns the number of key-value mappings in this map.
    * </summary>
    */
    size() {
        return Object.keys(this.dict).length;
    };

    /*
    * <summary>
    * boolean isEmpty()
    * This method returns a boolean
    * determining whether the TreeMap is empty or not.
    * </summary>
    */
    isEmpty() {
        return Object.keys(this.dict).length == 0;
    };


    /*
    * <summary>
    * Key floorKey(K key)
    * This method returns the greatest key less than or equal
    * to the given key, or null if there is no such key.
    * </summary>
    */
    floorKey(key){
      if(!isNumber(key))
        throw "Invalid Operation: key has to be an integer value";

      if(this.containsKey(key))
        return this.get(key);

      return this.floorKey(key - 1);
    }


    /*
    * <summary>
    * Key ceilingKey(K key)
    * This method returns the least key greater than or equal
    * to the given key, or null if there is no such key.
    * </summary>
    */
    ceilingKey(key) {
      if(!isNumber(key))
        throw "Invalid Operation: key has to be an integer value";

      if(this.containsKey(key))
        return this.get(key);

      return this.floorKey(key + 1);
    }


    /*
    * <summary>
    * Object clone()
    * This method returns a shallow copy of this TreeMap instance.
    * </summary>
    */
    clone() {
      return this.dict;
    }


    /*
    * <summary>
    * boolean containsValue(Object value)
    * This method returns true if this map maps one or more keys to the specified value.
    * </summary>
    */
    containsValue(value) {
      var len = this.size();
      for (i = 0; i < len; i++) {
          var item = this.get( Object.keys(this.dict)[i] );
          if(value === item)
            return true;
      }

      return false;
    }


    /*
    * <summary>
    * Set<K> keySet()
    * This method returns a Set view of the keys contained in this map.
    * </summary>
    */
    keySet() {
      var set = [];
      var len = this.size();
      for (i = 0; i < len; i++) {
        set.push(Object.keys(this.dict)[i]);
      }

      return set;
    }


    /*
    * <summary>
    * Key firstKey()
    * This method returns the first (lowest) key currently in this map.
    * </summary>
    */
    firstKey() {
      return Object.keys(this.dict)[0];
    }


    /*
    * <summary>
    * Key lastKey()
    * This method returns the last (highest) key currently in this map.
    * </summary>
    */
    lastKey() {
      var len = this.size();
      return Object.keys(this.dict)[len - 1];
    }

}

// some more functions which might be required to complete the operations of TreeMap -->

// Checks if the input is a number or not
function isNumber( input ) {
  return !isNaN( input );
}

// Sorts a JavaScript dictionary by key
function sortOnKeys(dict) {

    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}

// Checks if all the keys in the JavaScript dictionary are numeral. 
// If Yes, then it returns true or else it returns false
function allKeysAreNumeral(dict) {
  for(var key in dict) {
      if(!isNumber(key))
        return false;
  }

  return true;
}
