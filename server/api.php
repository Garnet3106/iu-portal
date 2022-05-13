<?php

error_reporting(E_ALL);
ini_set("display_errors", "1");

require "vendor/autoload.php";

Dotenv\Dotenv::createImmutable(__DIR__)->load();

run();

function run() {
    $assignment_table = new AssignmentTable();

    try {
        $assignment_table->login();
    } catch(PDOException $e) {
        JsonApi.print_error("Failed to connect to database server.");
    }

    try {
        var_dump($assignment_table->get_all_assignments());
    } catch(PDOException $e) {
        JsonApi.print_error("Failed to load assignment data.");
    }

    // todo
    $pdo = null;

    return [
        "kind" => "ok",
    ];
}

class JsonApi {
    static function print($json_obj) {
        print(json_encode($json_obj));
        exit();
    }

    static function print_error($msg) {
        JsonApi.print([
            "status" => "error",
            "message" => "Failed to execute SQL query.",
        ]);
    }

    static function print_assignment_list($msg) {
        JsonApi.print([
            "status" => "ok",
            "message" => "Failed to execute SQL query.",
        ]);
    }
}

class DatabaseException {
    public $assoc = [];

    public function __construct() {
        $this->assoc = [
            "kind" => "error",
            "message" => $msg,
        ];
    }
}

class AssignmentTable {
    private $is_logging_in = false;
    private $pdo;

    public function __construct() {}

    public function login() {
        try {
            $dsn = $_ENV["DB_DSN"];
            $usrname = $_ENV["DB_USERNAME"];
            $psw = $_ENV["DB_PASSWORD"];

            $pdo = new PDO($dsn, $usrname, $psw, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);

            $this->is_logging_in = true;
            $this->pdo = $pdo;
        } catch(PDOException $e) {
            throw $e;
        }
    }

    function execute_query($query, $bind_values = null) {
        try {
            $stmt = $this->pdo->prepare($query);

            if ($bind_values !== null) {
                foreach ($bind_values as $each_bind_key => $each_bind_value) {
                    $stmt->bindValue($each_bind_key, $each_bind_value);
                }
            }

            $succeeded = $stmt->execute();

            if (!$succeeded) {
                throw new DatabaseException();
            }

            return $stmt;
        } catch(PDOException $e) {
            throw $e;
        }
    }

    public function get_assignment_by_id($id) {
        $stmt = $this->execute_query("SELECT * FROM assignment WHERE id = :id", [
            'id' => $id,
        ]);

        $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$assignment) {
            return null;
        }

        return $assignment;
    }

    public function get_all_assignments() {
        $stmt = $this->execute_query("SELECT * FROM assignment");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>
