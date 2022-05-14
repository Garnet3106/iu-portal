<?php

error_reporting(E_ALL);
ini_set("display_errors", "1");

require "vendor/autoload.php";

Dotenv\Dotenv::createImmutable(__DIR__)->load();

class JsonApi {
    public static function respond($json_obj) {
        var_dump($json_obj);
        // todo: print(json_encode($json_obj));
        exit();
    }

    public static function respond_error($msg) {
        JsonApi::respond([
            "status" => "error",
            "message" => $msg,
        ]);
    }

    public static function respond_assignments($assignments) {
        JsonApi::respond([
            "status" => "ok",
            "assignments" => $assignments,
        ]);
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
                JsonApi::respond_error("Failed to execute SQL query.");
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

$req = [
    "action" => "create_assignments",
    "content" => [
        "assignments" => [
            [
                "course_id" => "3db893b5-d247-11ec-8085-49bfe3345a29",
                "lecture_id" => "3db893b5-d247-11ec-8085-49bfe3345a29",
                "registration_time" => time(),
                "assigned_from" => "3db893b5-d247-11ec-8085-49bfe3345a29",
                "submit_to" => "3db893b5-d247-11ec-8085-49bfe3345a29",
                "deadline" => time(),
                "description" => "desc",
                "note" => "notes",
            ],
        ],
    ],
];

run($req);

function run($req) {
    $assignment_table = new AssignmentTable();

    try {
        $assignment_table->login();
    } catch(PDOException $e) {
        JsonApi::respond_error("Failed to connect to database server.");
    }

    try {
        if (!array_key_exists("action", $req)) {
            JsonApi::respond_error("Property `action` is not defined.");
        }

        switch ($req["action"]) {
            case "create_assignments": {
                $assignments = $assignment_table->get_all_assignments();
                JsonApi::respond_assignments($assignments);
            } break;
            default: {
                JsonApi::respond_error("Unknown action kind is provided.");
            } break;
        }
    } catch(PDOException $e) {
        JsonApi::respond_error("Failed to load assignment data.");
    }
}

?>
