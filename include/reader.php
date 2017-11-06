<?php

class Reader
{
	private $stats_count = 0;
	private $stats_full  = 0;
	private $stats_some  = 0;

	private $full        = [];
	private $partial     = [];
	private $unsupported = [];

	/**
	 * @return int
	 */
	public function getCount() {
		return $this->stats_count;
	}

	/**
	 * @return int
	 */
	public function getPartialCount() {
		return $this->stats_some;
	}

	/**
	 * @return int
	 */
	public function getFullCount() {
		return $this->stats_full;
	}

	/**
	 * @return array
	 */
	public function getFull() {
		return $this->full;
	}

	/**
	 * @return array
	 */
	public function getPartial() {
		return $this->partial;
	}

	/**
	 * @return array
	 */
	public function getUnsupported() {
		return $this->unsupported;
	}

	public function __construct($filename = '') {
		$this->read($filename);
	}

	private function read($filename) {
		$data = json_decode( file_get_contents( $filename ) );

		foreach ( $data as $item ) {
			$this->stats_count++;

			if ( $item->ipv6 ) {
				if ( $item->partial ) {
					$this->stats_some++;
					if ( $item->partial ) {
						$this->partial[] = $item;
					}
				} else {
					$this->stats_full++;
					$this->full[] = $item;
				}
			} else {
				$this->unsupported[] = $item;
			}
		}
	}
}